import * as THREE from "three";

/**
 * "The Assembly" — one construct, four states.
 *
 * Every instance keeps its identity across all four formations, and the edge
 * pairs are computed ONCE from the core formation. That is the whole trick:
 * because the same parts stay wired to the same neighbours, morphing between
 * formations reads as a circuit rearranging itself rather than as four
 * unrelated shapes cross-fading.
 */

export const COUNT_HIGH = 224;
export const COUNT_LOW = 96;
export const FORMATIONS = 4;

/** Deterministic PRNG — the construct must look identical on every load. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Assembly = {
  count: number;
  /** count * FORMATIONS * 3 */
  positions: Float32Array;
  /** count * FORMATIONS * 4 (quaternions) */
  quaternions: Float32Array;
  /** count * 3 — per-instance box scale */
  scales: Float32Array;
  /** count — scatter origin, the pre-assembly cloud */
  scatter: Float32Array;
  /** count — 0 rod, 1 plate, 2 node */
  kinds: Float32Array;
  /** count — shader phase offset so pulses do not fire in unison */
  phases: Float32Array;
  /** edge index pairs into instances */
  edges: Uint16Array;
};

const _v = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);

/** Align the rod's local +Y to `dir`. */
function quatTo(dir: THREE.Vector3, out: THREE.Quaternion) {
  return out.setFromUnitVectors(_up, dir.normalize());
}

export function buildAssembly(count = COUNT_HIGH): Assembly {
  const rand = mulberry32(0x5eed);
  const positions = new Float32Array(count * FORMATIONS * 3);
  const quaternions = new Float32Array(count * FORMATIONS * 4);
  const scales = new Float32Array(count * 3);
  const scatter = new Float32Array(count * 3);
  const kinds = new Float32Array(count);
  const phases = new Float32Array(count);

  const setPos = (i: number, f: number, x: number, y: number, z: number) => {
    const o = (f * count + i) * 3;
    positions[o] = x;
    positions[o + 1] = y;
    positions[o + 2] = z;
  };
  const setQuat = (i: number, f: number, q: THREE.Quaternion) => {
    const o = (f * count + i) * 4;
    quaternions[o] = q.x;
    quaternions[o + 1] = q.y;
    quaternions[o + 2] = q.z;
    quaternions[o + 3] = q.w;
  };

  // ---- per-instance identity -------------------------------------------
  for (let i = 0; i < count; i++) {
    const r = rand();
    const kind = r < 0.62 ? 0 : r < 0.88 ? 1 : 2;
    kinds[i] = kind;
    phases[i] = rand();

    if (kind === 0) {
      // rod: long, thin
      scales[i * 3] = 0.022 + rand() * 0.012;
      scales[i * 3 + 1] = 0.2 + rand() * 0.3;
      scales[i * 3 + 2] = 0.022 + rand() * 0.012;
    } else if (kind === 1) {
      // plate: flat, wide
      scales[i * 3] = 0.15 + rand() * 0.16;
      scales[i * 3 + 1] = 0.012;
      scales[i * 3 + 2] = 0.1 + rand() * 0.12;
    } else {
      // node: small cube, the solder joints
      const s = 0.045 + rand() * 0.03;
      scales[i * 3] = s;
      scales[i * 3 + 1] = s;
      scales[i * 3 + 2] = s;
    }

    // Scatter cloud: a wide shell the parts fly in from on load.
    const a = rand() * Math.PI * 2;
    const b = Math.acos(2 * rand() - 1);
    const rad = 9 + rand() * 7;
    scatter[i * 3] = Math.sin(b) * Math.cos(a) * rad;
    scatter[i * 3 + 1] = Math.sin(b) * Math.sin(a) * rad * 0.7;
    scatter[i * 3 + 2] = Math.cos(b) * rad;
  }

  // ---- formation 0: CORE ------------------------------------------------
  // Rounded-cube shell (L4 norm) so it reads as a machined construct rather
  // than a ball, plus an interior layer for parallax depth.
  const R = 1.78;
  for (let i = 0; i < count; i++) {
    // Fibonacci direction, then normalised under the L4 norm.
    const t = (i + 0.5) / count;
    const phi = Math.acos(1 - 2 * t);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    _v.set(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi),
    );
    const l4 = Math.pow(
      Math.pow(Math.abs(_v.x), 4) +
        Math.pow(Math.abs(_v.y), 4) +
        Math.pow(Math.abs(_v.z), 4),
      0.25,
    );
    const inner = i % 4 === 0 ? 0.52 : 1;
    const radial = _v.clone().normalize();
    _v.multiplyScalar((R * inner) / l4);
    setPos(i, 0, _v.x, _v.y, _v.z);
    setQuat(i, 0, quatTo(radial, _q)); // parts point outward from the core
  }

  // ---- formation 1: GRID (software) ------------------------------------
  // A regular component lattice — a DOM tree, a module graph.
  const nx = 8;
  const ny = 7;
  const step = 0.46;
  for (let i = 0; i < count; i++) {
    const k = Math.floor(i / (nx * ny));
    const rem = i % (nx * ny);
    const x = (rem % nx) - (nx - 1) / 2;
    const y = Math.floor(rem / nx) - (ny - 1) / 2;
    const z = k - 1;
    setPos(i, 1, x * step, y * step, z * step * 1.9);
    // Axis-aligned: three orthogonal orientations, chosen deterministically.
    const axis = i % 3;
    _v.set(axis === 0 ? 1 : 0, axis === 1 ? 1 : 0, axis === 2 ? 1 : 0);
    setQuat(i, 1, quatTo(_v, _q));
  }

  // ---- formation 2: TRACE (hardware) -----------------------------------
  // Everything collapses onto a board plane and snaps to a routing grid.
  // Orientation is restricted to X or Y, which is what makes it read PCB.
  const cell = 0.34;
  for (let i = 0; i < count; i++) {
    const gx = Math.round((rand() * 2 - 1) * 8);
    const gy = Math.round((rand() * 2 - 1) * 5);
    // Tiny z spread keeps it from z-fighting and gives the board thickness.
    setPos(i, 2, gx * cell, gy * cell, (rand() - 0.5) * 0.12);
    const horizontal = rand() > 0.5;
    _v.set(horizontal ? 1 : 0, horizontal ? 0 : 1, 0);
    setQuat(i, 2, quatTo(_v, _q));
  }

  // ---- formation 3: FAN (creative) -------------------------------------
  // Stacked, fanned planes — layered comps on an edit timeline.
  const layers = 6;
  for (let i = 0; i < count; i++) {
    const layer = i % layers;
    const within = Math.floor(i / layers);
    const spread = Math.ceil(count / layers);
    const u = within / Math.max(1, spread - 1);
    const yaw = (layer / (layers - 1) - 0.5) * 0.9;
    const lx = (u * 2 - 1) * 2.3;
    const ly = (layer - (layers - 1) / 2) * 0.5;
    setPos(
      i,
      3,
      lx * Math.cos(yaw),
      ly + Math.sin(u * Math.PI) * 0.18,
      lx * Math.sin(yaw) * 0.85,
    );
    // Lie along the timeline direction.
    _v.set(Math.cos(yaw), 0, Math.sin(yaw));
    setQuat(i, 3, quatTo(_v, _q));
  }

  // ---- edges: nearest neighbours in the CORE formation ------------------
  const edgePairs: number[] = [];
  const NEIGHBOURS = 2;
  // Anything longer than this is not a neighbour, it is a chord across the
  // shell — those are what turn the wiring into visual noise.
  const MAX_EDGE = 0.95;
  for (let i = 0; i < count; i++) {
    const ax = positions[i * 3];
    const ay = positions[i * 3 + 1];
    const az = positions[i * 3 + 2];
    // Track the N closest without sorting the whole list.
    const best: { j: number; d: number }[] = [];
    for (let j = 0; j < count; j++) {
      if (j === i) continue;
      const dx = positions[j * 3] - ax;
      const dy = positions[j * 3 + 1] - ay;
      const dz = positions[j * 3 + 2] - az;
      const d = dx * dx + dy * dy + dz * dz;
      if (best.length < NEIGHBOURS) {
        best.push({ j, d });
        best.sort((p, q) => p.d - q.d);
      } else if (d < best[best.length - 1].d) {
        best[best.length - 1] = { j, d };
        best.sort((p, q) => p.d - q.d);
      }
    }
    for (const { j, d } of best) {
      // Deduplicate: store each undirected pair once.
      if (i < j && Math.sqrt(d) <= MAX_EDGE) edgePairs.push(i, j);
    }
  }

  return {
    count,
    positions,
    quaternions,
    scales,
    scatter,
    kinds,
    phases,
    edges: Uint16Array.from(edgePairs),
  };
}
