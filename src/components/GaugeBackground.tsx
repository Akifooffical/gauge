"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Tek bir tam ekran üçgen (clip-space) — kamera dönüşümünü atlar, GPU'ya en ucuz fullscreen quad.
const FULLSCREEN_TRIANGLE = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uIntensity;
  uniform float uPaletteShift;

  float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }

  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    float a=hash(i), b=hash(i+vec2(1.0,0.0)), c=hash(i+vec2(0.0,1.0)), d=hash(i+vec2(1.0,1.0));
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
  }

  float fbm(vec2 p){
    float v=0.0,a=0.5;
    for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.5; }
    return v;
  }

  vec3 pal(float t){
    return 0.5+0.5*cos(6.28318*(t+uPaletteShift+vec3(0.00,0.33,0.67)));
  }

  float ign(vec2 p){
    return fract(52.9829189*fract(dot(p,vec2(0.06711056,0.00583715))));
  }

  void main(){
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = (frag - 0.5*uResolution)/uResolution.y;
    uv += uMouse*0.10;
    float t = uTime*0.05;

    // domain-warped prizmatik alan (aurora)
    vec2 q = uv*1.3;
    float warp = fbm(q*1.2 + vec2(t*1.5,-t));
    float field = fbm(q + warp*0.8 + vec2(-t, t*0.6));

    float r = length(uv);
    float ang = atan(uv.y, uv.x);

    // sinematik koyu prizmatik zemin
    vec3 col = pal(field*0.6 + r*0.4 + t*0.5);
    col = mix(vec3(0.02,0.02,0.05), col, 0.28);
    col *= (0.65 + 0.6*field) * uIntensity;

    // merkezde ışıyan gauge küresi
    float core = smoothstep(0.55, 0.02, r);
    col += core*core * pal(0.15 + t*0.5 + field*0.3) * 0.9;
    col += smoothstep(0.16,0.0,r) * vec3(0.85,0.82,1.0) * 0.55;

    // dönen gauge yayı (instrument arc)
    float ringW = smoothstep(0.011, 0.0, abs(r-0.44));
    float sweep = smoothstep(-0.2, 0.95, sin(ang*3.0 - uTime*0.5));
    col += ringW * (0.22 + sweep) * pal(0.55 + t) * 1.5;
    // dış ince enstrüman halkası
    col += smoothstep(0.004,0.0,abs(r-0.63)) * 0.16 * pal(0.55+t);

    // vignette
    col *= 1.0 - 0.6*smoothstep(0.45,1.2,r);

    // retro dither kuantizasyonu + film grain
    float d = ign(frag);
    float levels = 30.0;
    col = floor(col*levels + d)/levels;
    col += (hash(frag + uTime) - 0.5)*0.03;

    gl_FragColor = vec4(max(col,0.0), 1.0);
  }
`;

function GaugeScene({
  intensity,
  paletteShift,
  reduceMotion,
}: {
  intensity: number;
  paletteShift: number;
  reduceMotion: boolean;
}) {
  const { size, gl } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const targetMouse = useRef({ x: 0, y: 0 });
  const targetIntensity = useRef(intensity);
  const targetPaletteShift = useRef(paletteShift);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(FULLSCREEN_TRIANGLE, 3));
    return geo;
  }, []);

  // shaderMaterial'in tek seferlik başlangıç uniform değerleri. Sonraki güncellemeler
  // materialRef.current.uniforms üzerinden, render dışında (useFrame/useEffect içinde) yapılır.
  const initialUniforms = useMemo(
    () => ({
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 8.0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: intensity },
      uPaletteShift: { value: paletteShift },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sadece ilk değer; güncellemeler materialRef üzerinden gider
    []
  );

  useEffect(() => {
    targetIntensity.current = intensity;
  }, [intensity]);

  useEffect(() => {
    targetPaletteShift.current = paletteShift;
  }, [paletteShift]);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      targetMouse.current.x = e.clientX / window.innerWidth - 0.5;
      targetMouse.current.y = -(e.clientY / window.innerHeight - 0.5);
    }
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;
    const dpr = gl.getPixelRatio();
    material.uniforms.uResolution.value.set(size.width * dpr, size.height * dpr);

    // sayfa/rota değişince hedef palet & yoğunluğa yumuşakça geçiş yap
    material.uniforms.uIntensity.value +=
      (targetIntensity.current - material.uniforms.uIntensity.value) * 0.03;
    material.uniforms.uPaletteShift.value +=
      (targetPaletteShift.current - material.uniforms.uPaletteShift.value) * 0.03;

    if (reduceMotion) {
      material.uniforms.uTime.value = 8.0;
      return;
    }

    material.uniforms.uTime.value = state.clock.elapsedTime;
    mouse.current.x += (targetMouse.current.x - mouse.current.x) * 0.1;
    mouse.current.y += (targetMouse.current.y - mouse.current.y) * 0.1;
    material.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={initialUniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export function GaugeBackground({
  intensity = 1,
  paletteShift = 0,
}: {
  intensity?: number;
  paletteShift?: number;
}) {
  const [reduceMotion, setReduceMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [active, setActive] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    function onVisibility() {
      setActive(document.visibilityState === "visible");
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        frameloop={active ? "always" : "demand"}
        camera={{ position: [0, 0, 1] }}
        fallback={<div className="h-full w-full bg-hero-bg" />}
      >
        <GaugeScene intensity={intensity} paletteShift={paletteShift} reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}
