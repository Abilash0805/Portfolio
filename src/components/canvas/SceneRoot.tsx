"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, type ChromaticAberrationEffect } from "postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

import { flux } from "@/lib/store";
import type { Tier } from "@/lib/useEnv";
import { Assembly } from "./Assembly";
import { Starfield } from "./Starfield";

/**
 * The camera does not cut between sections — it travels one continuous spline
 * scrubbed by scroll position. Chapter boundaries are just points on the
 * curve, which is what keeps the whole page feeling like a single move.
 */
function CameraRig() {
  const path = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, 0.25, 8.4), // core   — hero, head on
          new THREE.Vector3(3.6, 1.5, 7.6), // grid   — step aside, look in
          new THREE.Vector3(0.5, 4.6, 5.9), // trace  — rise, look down at the board
          new THREE.Vector3(-4.4, 0.6, 6.8), // fan    — swing around the layers
        ],
        false,
        "catmullrom",
        0.4,
      ),
    [],
  );

  // Scratch vectors written every frame, so they live on a ref.
  const scratch = useRef({
    target: new THREE.Vector3(),
    desired: new THREE.Vector3(),
  });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    // Chapter, not raw scroll: the camera and the construct read the same
    // clock, so they can never disagree about where in the story we are.
    const t = THREE.MathUtils.clamp(flux.chapter / 3, 0, 1);
    const { desired, target } = scratch.current;

    path.getPointAt(t, desired);

    // Pointer parallax rides on top of the scroll position, never replaces it.
    desired.x += flux.pointer.x * 0.42;
    desired.y += flux.pointer.y * 0.3;
    // Pull back a touch under fast scroll so the shear has room to read.
    desired.multiplyScalar(1 + flux.energy * 0.06);

    state.camera.position.lerp(desired, 1 - Math.pow(0.0015, dt));

    target.set(0, THREE.MathUtils.lerp(0, -0.35, t), 0);
    state.camera.lookAt(target);

    const cam = state.camera as THREE.PerspectiveCamera;
    const fov = 38 + flux.energy * 3.2;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, fov, dt * 3);
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

/** Aberration and bloom track scroll energy, so speed is legible as strain. */
function ReactiveEffects({ tier }: { tier: Tier }) {
  const ca = useRef<ChromaticAberrationEffect>(null);

  useFrame((_, delta) => {
    if (!ca.current) return;
    const dt = Math.min(delta, 0.05);
    const amount = flux.energy * 0.0016;
    ca.current.offset.x = THREE.MathUtils.lerp(ca.current.offset.x, amount, dt * 8);
    ca.current.offset.y = THREE.MathUtils.lerp(
      ca.current.offset.y,
      amount * 0.6,
      dt * 8,
    );
  });

  if (tier === "low") {
    // One cheap pass only — scroll smoothness outranks fidelity here.
    return (
      <EffectComposer>
        <Bloom intensity={0.7} luminanceThreshold={0.4} mipmapBlur />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.95}
        luminanceThreshold={0.34}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
      <ChromaticAberration
        ref={ca}
        offset={new THREE.Vector2(0, 0)}
        radialModulation={false}
        modulationOffset={0}
      />
      <Noise opacity={0.035} blendFunction={BlendFunction.OVERLAY} />
      <Vignette offset={0.22} darkness={0.7} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  );
}

export default function SceneRoot({ tier }: { tier: Tier }) {
  return (
    <Canvas
      dpr={[1, tier === "high" ? 1.85 : 1.25]}
      gl={{
        antialias: tier === "high",
        powerPreference: "high-performance",
        alpha: true,
      }}
      camera={{ fov: 38, near: 0.1, far: 60, position: [0, 0.25, 8.4] }}
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <CameraRig />

        <ambientLight intensity={0.16} />
        <directionalLight position={[4, 6, 5]} intensity={1.2} color="#cfe0ff" />
        {/* Two rims in tension: cold signal blue against a near-white key, so
            the chrome reads as metal rather than as a blue-tinted surface. */}
        <pointLight position={[-6, -2, 3]} intensity={26} color="#2563eb" distance={22} />
        <pointLight position={[5, 3, -4]} intensity={18} color="#7dd3fc" distance={22} />

        {/* Reflections are generated locally from lightformers. No HDR is
            fetched at runtime, so the metal reads correctly offline and the
            first paint is not gated on a texture download. */}
        <Environment resolution={tier === "high" ? 128 : 64} frames={1}>
          <Lightformer
            form="rect"
            intensity={2.4}
            color="#ffffff"
            position={[0, 4, -4]}
            scale={[10, 4, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.5}
            color="#3b82f6"
            position={[-5, -1, 2]}
            scale={[6, 6, 1]}
            rotation={[0, Math.PI / 2, 0]}
          />
          <Lightformer
            form="circle"
            intensity={1.1}
            color="#dbeafe"
            position={[5, 2, 2]}
            scale={[4, 4, 1]}
            rotation={[0, -Math.PI / 2, 0]}
          />
        </Environment>

        <Starfield count={tier === "high" ? 1200 : 450} />
        <Assembly tier={tier} />
        <ReactiveEffects tier={tier} />
      </Suspense>
    </Canvas>
  );
}
