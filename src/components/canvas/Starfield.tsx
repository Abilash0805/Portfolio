"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { flux } from "@/lib/store";

/**
 * The deep field the construct sits in. Two things keep it from looking like
 * a screensaver: the stars drift on a slow axis of their own, and the whole
 * field is pushed along Z by scroll progress, so moving down the page reads
 * as travelling into the field rather than scrolling past a backdrop.
 */
export function Starfield({ count = 1200 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);

    // Deterministic so the sky is the same on every load.
    let s = 1337;
    const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

    for (let i = 0; i < count; i++) {
      // A shell, not a cube — keeps density even in every direction.
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      const r = 24 + rnd() * 26;
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.75;
      positions[i * 3 + 2] = Math.cos(phi) * r;
      sizes[i] = 0.5 + rnd() * 1.6;
      seeds[i] = rnd();
    }

    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uEnergy: { value: 0 },
          uWarm: { value: new THREE.Color("#dce8ff") },
          uCool: { value: new THREE.Color("#3b82f6") },
        },
        vertexShader: /* glsl */ `
          attribute float aSize;
          attribute float aSeed;
          uniform float uTime;
          uniform float uEnergy;
          varying float vSeed;
          void main() {
            vSeed = aSeed;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            // Faster scrolling stretches the field slightly toward the camera.
            mv.xyz *= 1.0 - uEnergy * 0.04;
            gl_Position = projectionMatrix * mv;
            // Clamped: without this, a star that drifts near the camera
            // blows up into a blurry disc instead of staying a star.
            gl_PointSize = clamp(aSize * (260.0 / -mv.z), 0.8, 3.2);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform vec3 uWarm;
          uniform vec3 uCool;
          varying float vSeed;
          void main() {
            // Round, soft point — no texture needed.
            vec2 d = gl_PointCoord - 0.5;
            float r = length(d);
            if (r > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, r);
            // Slow, per-star twinkle.
            float twinkle = 0.65 + 0.35 * sin(uTime * 0.7 + vSeed * 40.0);
            vec3 tint = mix(uCool, uWarm, vSeed);
            gl_FragColor = vec4(tint, alpha * twinkle * 0.9);
          }
        `,
      }),
    [],
  );

  useFrame((state, delta) => {
    const p = points.current;
    if (!p) return;
    const dt = Math.min(delta, 0.05);
    const mat = p.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uEnergy.value = flux.energy;

    p.rotation.y += dt * 0.008;
    // Travel into the field as the story advances.
    p.position.z = THREE.MathUtils.lerp(p.position.z, flux.progress * 14, dt * 1.6);
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
