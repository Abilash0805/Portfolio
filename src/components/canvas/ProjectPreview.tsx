"use client";

import { useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { ProjectImage } from "@/components/ui/ProjectImage";
import { flux } from "@/lib/store";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Warp pulls the image toward the pointer and splits the channels along the
 * same vector, so the distortion has a direction instead of just wobbling.
 */
const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform vec2 uCover;
  uniform float uHover;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv - 0.5) * uCover + 0.5;
    vec2 d = uv - uMouse;
    float dist = length(d);

    float pull = uHover * exp(-dist * 3.4) * 0.14;
    vec2 warped = uv - d * pull;

    float ab = uHover * 0.0055 + uEnergy * 0.004;
    vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0);
    float r = texture2D(uTexture, warped + dir * ab).r;
    float g = texture2D(uTexture, warped).g;
    float b = texture2D(uTexture, warped - dir * ab).b;

    // Lift toward the pointer so the surface reads as lit, not just moved.
    float lift = uHover * exp(-dist * 4.0) * 0.09;
    gl_FragColor = vec4(vec3(r, g, b) + lift, 1.0);
    #include <colorspace_fragment>
  }
`;

function Plane({ src, hover }: { src: string; hover: React.RefObject<number> }) {
  // Configured through the loader callback rather than mutated after the
  // fact, so the hook owns the texture's state.
  const texture = useTexture(src, (loaded) => {
    const t = Array.isArray(loaded) ? loaded[0] : loaded;
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
  });
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uCover: { value: new THREE.Vector2(1, 1) },
      uHover: { value: 0 },
      uEnergy: { value: 0 },
    }),
    [texture],
  );

  useFrame((state, delta) => {
    // Uniforms are mutated through the material that owns them, not through
    // the memoised object, so nothing captured by render is written to.
    const u = mat.current?.uniforms;
    if (!u) return;
    const dt = Math.min(delta, 0.05);
    const img = texture.image as { width: number; height: number } | undefined;

    if (img?.width) {
      // Cover-fit: shrink the sampled window on the axis that would letterbox.
      const planeAspect = viewport.width / viewport.height;
      const texAspect = img.width / img.height;
      if (texAspect > planeAspect) {
        u.uCover.value.set(planeAspect / texAspect, 1);
      } else {
        u.uCover.value.set(1, texAspect / planeAspect);
      }
    }

    u.uHover.value = THREE.MathUtils.lerp(u.uHover.value, hover.current, dt * 7);
    u.uEnergy.value = flux.energy;

    // Pointer in this canvas's local 0..1 space.
    const p = state.pointer;
    u.uMouse.value.set(p.x * 0.5 + 0.5, p.y * 0.5 + 0.5);

    if (mesh.current) {
      const k = u.uHover.value as number;
      mesh.current.rotation.y = THREE.MathUtils.lerp(
        mesh.current.rotation.y,
        p.x * 0.13 * k,
        dt * 6,
      );
      mesh.current.rotation.x = THREE.MathUtils.lerp(
        mesh.current.rotation.x,
        -p.y * 0.1 * k,
        dt * 6,
      );
    }
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[viewport.width, viewport.height, 1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

/**
 * WebGL preview. Only mounted for capable devices with motion allowed — the
 * plain path lives in ProjectImage so this module (and three.js with it) is
 * never fetched otherwise.
 */
export default function ProjectPreview({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const hover = useRef(0);
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    // Only run the context while the preview is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrap}
      className="relative"
      onPointerEnter={() => (hover.current = 1)}
      onPointerLeave={() => (hover.current = 0)}
    >
      {/* Real img underneath: the content is reachable even if WebGL fails. */}
      <ProjectImage src={src} alt={alt} />
      {visible && (
        <Canvas
          className="absolute inset-0"
          dpr={[1, 1.75]}
          orthographic={false}
          camera={{ fov: 50, position: [0, 0, 1.2] }}
          gl={{ antialias: false }}
        >
          <Suspense fallback={null}>
            <Plane src={src} hover={hover} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
