"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { flux, useUI } from "@/lib/store";
import {
  buildAssembly,
  COUNT_HIGH,
  COUNT_LOW,
  FORMATIONS,
} from "./formations";
import {
  createEdgeMaterial,
  createPartsMaterial,
  type SignalUniforms,
} from "./signalMaterial";

// Scratch objects, allocated once. Nothing may allocate inside useFrame.
const _pos = new THREE.Vector3();
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _qa = new THREE.Quaternion();
const _qb = new THREE.Quaternion();
const _q = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _m = new THREE.Matrix4();
const _pointer = new THREE.Vector3();
const _ray = new THREE.Vector3();

const smoothstep = (x: number) => x * x * (3 - 2 * x);

export function Assembly({ tier }: { tier: "high" | "low" }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);
  const assembleT = useRef(0);
  const entered = useUI((s) => s.entered);

  const data = useMemo(
    () => buildAssembly(tier === "high" ? COUNT_HIGH : COUNT_LOW),
    [tier],
  );

  const parts = useMemo(() => createPartsMaterial(), []);
  const wires = useMemo(() => createEdgeMaterial(), []);

  // Current resolved positions, reused to drive the wire geometry so the
  // wires always agree with where the parts actually ended up this frame.
  // Held on a ref because it is written every frame by design.
  const scratch = useRef({ buf: new Float32Array(0) });

  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(1, 1, 1);
    g.setAttribute(
      "aPhase",
      new THREE.InstancedBufferAttribute(data.phases, 1),
    );
    return g;
  }, [data.phases]);

  const wireGeometry = useMemo(() => {
    const segs = data.edges.length / 2;
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(segs * 2 * 3);
    const progress = new Float32Array(segs * 2);
    const seed = new Float32Array(segs * 2);
    for (let s = 0; s < segs; s++) {
      progress[s * 2] = 0;
      progress[s * 2 + 1] = 1;
      const r = (Math.sin(s * 12.9898) * 43758.5453) % 1;
      seed[s * 2] = seed[s * 2 + 1] = r < 0 ? r + 1 : r;
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aProgress", new THREE.BufferAttribute(progress, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [data.edges]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      wireGeometry.dispose();
      parts.material.dispose();
      wires.material.dispose();
    };
  }, [geometry, wireGeometry, parts.material, wires.material]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    if (!mesh || !group) return;

    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;

    if (scratch.current.buf.length !== data.count * 3) {
      scratch.current.buf = new Float32Array(data.count * 3);
    }
    const current = scratch.current.buf;

    // --- entrance: parts fly in from the scatter shell and materialise ----
    if (entered && assembleT.current < 1) {
      assembleT.current = Math.min(1, assembleT.current + dt * 0.42);
    }
    const at = assembleT.current;

    // --- which formation are we between --------------------------------
    const c = THREE.MathUtils.clamp(flux.chapter, 0, FORMATIONS - 1);
    const f0 = Math.floor(c);
    const f1 = Math.min(f0 + 1, FORMATIONS - 1);
    const mix = smoothstep(c - f0);

    const energy = flux.energy;
    const vel = flux.velocity;

    // --- pointer, projected to the construct's depth ---------------------
    _pointer.set(flux.pointer.x, flux.pointer.y, 0.5).unproject(state.camera);
    _ray.copy(_pointer).sub(state.camera.position).normalize();
    _pointer.copy(state.camera.position).addScaledVector(
      _ray,
      state.camera.position.length(),
    );
    group.worldToLocal(_pointer);

    const REPEL_RADIUS = 1.5;
    const repelStrength = tier === "high" ? 0.85 : 0.5;

    for (let i = 0; i < data.count; i++) {
      const o0 = (f0 * data.count + i) * 3;
      const o1 = (f1 * data.count + i) * 3;

      _a.set(data.positions[o0], data.positions[o0 + 1], data.positions[o0 + 2]);
      _b.set(data.positions[o1], data.positions[o1 + 1], data.positions[o1 + 2]);
      _pos.copy(_a).lerp(_b, mix);

      // Entrance stagger: each part has its own start time, so the construct
      // assembles progressively rather than snapping into place at once.
      const stagger = 0.55;
      const local = THREE.MathUtils.clamp(
        at * (1 + stagger) - data.phases[i] * stagger,
        0,
        1,
      );
      const ease = 1 - Math.pow(1 - local, 4);
      if (ease < 1) {
        _a.set(
          data.scatter[i * 3],
          data.scatter[i * 3 + 1],
          data.scatter[i * 3 + 2],
        );
        _pos.lerpVectors(_a, _pos, ease);
      }

      // Scroll velocity shears the cloud along X, proportional to height.
      // It settles back on its own because velocity decays to zero.
      _pos.x += vel * 0.55 * (_pos.y * 0.42 + 0.35);
      _pos.multiplyScalar(1 + Math.abs(vel) * 0.045);

      // Cursor repulsion — a field, not a hover state.
      const dx = _pos.x - _pointer.x;
      const dy = _pos.y - _pointer.y;
      const dz = _pos.z - _pointer.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-4;
      if (dist < REPEL_RADIUS) {
        const push = ((REPEL_RADIUS - dist) / REPEL_RADIUS) ** 2 * repelStrength;
        _pos.x += (dx / dist) * push;
        _pos.y += (dy / dist) * push;
        _pos.z += (dz / dist) * push;
      }

      current[i * 3] = _pos.x;
      current[i * 3 + 1] = _pos.y;
      current[i * 3 + 2] = _pos.z;

      const q0 = (f0 * data.count + i) * 4;
      const q1 = (f1 * data.count + i) * 4;
      _qa.set(
        data.quaternions[q0],
        data.quaternions[q0 + 1],
        data.quaternions[q0 + 2],
        data.quaternions[q0 + 3],
      );
      _qb.set(
        data.quaternions[q1],
        data.quaternions[q1 + 1],
        data.quaternions[q1 + 2],
        data.quaternions[q1 + 3],
      );
      _q.slerpQuaternions(_qa, _qb, mix);

      _scale.set(
        data.scales[i * 3],
        data.scales[i * 3 + 1],
        data.scales[i * 3 + 2],
      );
      _scale.multiplyScalar(ease);

      _m.compose(_pos, _q, _scale);
      mesh.setMatrixAt(i, _m);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // --- wires follow the parts -----------------------------------------
    const lines = linesRef.current;
    if (lines) {
      const attr = lines.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let e = 0; e < data.edges.length; e += 2) {
        const i = data.edges[e];
        const j = data.edges[e + 1];
        const w = e * 3;
        arr[w] = current[i * 3];
        arr[w + 1] = current[i * 3 + 1];
        arr[w + 2] = current[i * 3 + 2];
        arr[w + 3] = current[j * 3];
        arr[w + 4] = current[j * 3 + 1];
        arr[w + 5] = current[j * 3 + 2];
      }
      attr.needsUpdate = true;

      const wireMat = lines.material as THREE.ShaderMaterial;
      const wu = wireMat.userData.signal as SignalUniforms;
      wu.uTime.value = time;
      wu.uEnergy.value = energy;
      // Wires fade out as the construct flattens to a board, where the parts
      // themselves carry the trace read.
      wireMat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        wireMat.uniforms.uOpacity.value,
        1 - THREE.MathUtils.clamp((c - 1.2) / 1.1, 0, 1) * 0.72,
        dt * 4,
      );
    }

    const pu = (mesh.material as THREE.Material).userData.signal as SignalUniforms;
    pu.uTime.value = time;
    pu.uEnergy.value = energy;

    // --- keep the construct clear of the copy ----------------------------
    // Wide viewports put the copy on the left, so the construct slides right.
    // Narrow ones stack, so it lifts above the text block and shrinks instead.
    const wide = state.size.width / state.size.height > 1.15;
    group.position.x = THREE.MathUtils.lerp(
      group.position.x,
      wide ? 1.75 : 0,
      dt * 2.5,
    );
    group.position.y = THREE.MathUtils.lerp(
      group.position.y,
      wide ? 0 : 1.75,
      dt * 2.5,
    );
    const targetScale = wide ? 1 : 0.6;
    group.scale.setScalar(
      THREE.MathUtils.lerp(group.scale.x, targetScale, dt * 2.5),
    );

    // --- the construct's own slow drift + pointer parallax ---------------
    group.rotation.y += dt * 0.055;
    group.rotation.x = THREE.MathUtils.lerp(
      group.rotation.x,
      flux.pointer.y * -0.16,
      dt * 2.2,
    );
    group.rotation.z = THREE.MathUtils.lerp(
      group.rotation.z,
      flux.pointer.x * 0.07,
      dt * 2.2,
    );
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, parts.material, data.count]}
        frustumCulled={false}
        castShadow={false}
        receiveShadow={false}
      />
      <lineSegments
        ref={linesRef}
        geometry={wireGeometry}
        material={wires.material}
        frustumCulled={false}
      />
    </group>
  );
}
