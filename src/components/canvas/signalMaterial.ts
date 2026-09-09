import * as THREE from "three";

/**
 * The one custom shader on the site: current running through traces.
 *
 * A pulse travels along each part's long axis and along every wire, phase
 * offset per instance so the net never blinks in unison. Scroll energy feeds
 * the pulse gain, so the construct visibly carries more current the faster
 * you move.
 */

export type SignalUniforms = {
  uTime: { value: number };
  uEnergy: { value: number };
};

const SIGNAL = new THREE.Color("#5b9dff");

/**
 * PBR body with the pulse injected into emissive. Built on MeshStandardMaterial
 * rather than a raw ShaderMaterial so the parts still take real lighting —
 * the machined-metal read depends on it.
 */
export function createPartsMaterial(): {
  material: THREE.MeshStandardMaterial;
  uniforms: SignalUniforms;
} {
  const uniforms: SignalUniforms = { uTime: { value: 0 }, uEnergy: { value: 0 } };

  const material = new THREE.MeshStandardMaterial({
    // Dark chrome: reads as machined metal in a blue field rather than as
    // painted plastic.
    color: "#0d1424",
    roughness: 0.28,
    metalness: 0.94,
    envMapIntensity: 1.35,
  });

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uEnergy = uniforms.uEnergy;
    shader.uniforms.uPulse = { value: SIGNAL };

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
         attribute float aPhase;
         varying float vPhase;
         varying vec3 vLocal;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         // Unit box local space is -0.5..0.5, so y+0.5 is 0..1 along the part
         // regardless of how the instance matrix scaled it.
         vLocal = position;
         vPhase = aPhase;`,
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
         uniform float uTime;
         uniform float uEnergy;
         uniform vec3 uPulse;
         varying float vPhase;
         varying vec3 vLocal;`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
         float axis = vLocal.y + 0.5;
         float head = fract(uTime * 0.21 + vPhase);
         float d = abs(axis - head);
         d = min(d, 1.0 - d);                       // wrap the pulse
         float pulse = smoothstep(0.17, 0.0, d);
         // A faint always-on bias keeps the metal from going dead flat.
         totalEmissiveRadiance += uPulse * (pulse * (0.55 + uEnergy * 2.6) + 0.01);`,
      );
  };

  // Distinct key so three does not share a compiled program with plain
  // MeshStandardMaterials elsewhere in the scene.
  material.customProgramCacheKey = () => "assembly-parts-v2";

  // Published on the material so the render loop can reach the uniforms
  // through the object graph rather than through a captured closure.
  material.userData.signal = uniforms;

  material.userData.signal = uniforms;

  return { material, uniforms };
}

/** Additive wiring between parts. Pulses travel start -> end along each wire. */
export function createEdgeMaterial(): {
  material: THREE.ShaderMaterial;
  uniforms: SignalUniforms;
} {
  const uniforms: SignalUniforms = { uTime: { value: 0 }, uEnergy: { value: 0 } };

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      ...uniforms,
      uColor: { value: SIGNAL },
      uOpacity: { value: 1 },
    },
    vertexShader: /* glsl */ `
      attribute float aProgress;
      attribute float aSeed;
      varying float vProgress;
      varying float vSeed;
      void main() {
        vProgress = aProgress;
        vSeed = aSeed;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uEnergy;
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vProgress;
      varying float vSeed;
      void main() {
        float head = fract(uTime * 0.26 + vSeed);
        float d = abs(vProgress - head);
        d = min(d, 1.0 - d);
        float pulse = smoothstep(0.3, 0.0, d);
        float base = 0.055 + uEnergy * 0.1;
        float alpha = (base + pulse * 0.8) * uOpacity;
        if (alpha < 0.002) discard;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  });

  material.userData.signal = uniforms;

  return { material, uniforms };
}
