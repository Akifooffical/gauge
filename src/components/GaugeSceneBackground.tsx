"use client";

import { useEffect, useRef } from "react";
import { SCENES, type SceneKey } from "./gauge-scenes";

const VERT = `attribute vec2 aPos; void main(){ gl_Position=vec4(aPos,0.,1.); }`;
const FADE_SECONDS = 0.85;
const MAX_DPR = 1.75;

type Layer = {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;
  u: {
    res: WebGLUniformLocation | null;
    time: WebGLUniformLocation | null;
    mouse: WebGLUniformLocation | null;
    light: WebGLUniformLocation | null;
  };
};

function compile(canvas: HTMLCanvasElement, frag: string): Layer | null {
  const gl = (canvas.getContext("webgl2", { antialias: false, alpha: false }) ||
    canvas.getContext("webgl", { antialias: false, alpha: false })) as WebGLRenderingContext | null;
  if (!gl) return null;
  const mk = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s));
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, mk(gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, mk(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(p);
  gl.useProgram(p);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  // tek tam ekran üçgen — kamera dönüşümü yok, en ucuz fullscreen pass
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(p, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return {
    gl,
    canvas,
    u: {
      res: gl.getUniformLocation(p, "uRes"),
      time: gl.getUniformLocation(p, "uTime"),
      mouse: gl.getUniformLocation(p, "uMouse"),
      light: gl.getUniformLocation(p, "uLight"),
    },
  };
}

/**
 * Rota başına farklı bir WebGL sahnesi çizen tam ekran arka plan.
 * Sahne değişince iki katman arasında FADE_SECONDS boyunca çapraz geçiş yapar;
 * geçiş sırasında yeni bir istek gelirse mevcut geçiş anında tamamlanıp yenisi başlar.
 */
export function GaugeSceneBackground({
  scene,
  light = false,
}: {
  scene: SceneKey;
  light?: boolean;
}) {
  const layerRef0 = useRef<HTMLCanvasElement>(null);
  const layerRef1 = useRef<HTMLCanvasElement>(null);
  const layers = useRef<(Layer | null)[]>([null, null]);
  const front = useRef(0);
  const fade = useRef(1);
  const fading = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  const clock = useRef(6);
  const lightRef = useRef(light);
  const sceneRef = useRef<SceneKey>(scene);

  useEffect(() => {
    lightRef.current = light;
  }, [light]);

  // sahne değişimi → arka katmana derle, çapraz geçişi başlat
  useEffect(() => {
    const layerRefs = [layerRef0, layerRef1] as const;
    if (sceneRef.current === scene && layers.current[front.current]) return;
    sceneRef.current = scene;
    if (fading.current) {
      const b = 1 - front.current;
      if (layerRefs[b].current) layerRefs[b].current!.style.opacity = "1";
      if (layerRefs[front.current].current) layerRefs[front.current].current!.style.opacity = "0";
      layers.current[front.current] = null;
      front.current = b;
      fading.current = false;
      fade.current = 1;
    }
    const back = 1 - front.current;
    const canvas = layerRefs[back].current;
    if (!canvas) return;
    layers.current[back] = compile(canvas, SCENES[scene]);
    canvas.style.opacity = "0";
    fade.current = 0;
    fading.current = true;
  }, [scene]);

  useEffect(() => {
    const layerRefs = [layerRef0, layerRef1] as const;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (layerRef0.current) layers.current[0] = compile(layerRef0.current, SCENES[sceneRef.current]);

    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = document.visibilityState === "visible";
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const draw = (layer: Layer | null) => {
      if (!layer) return;
      const { gl, canvas, u } = layer;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = Math.max(2, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(2, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      const mx = Math.max(-0.9, Math.min(0.9, pointer.current.x / Math.max(1, window.innerWidth) - 0.5));
      const my = Math.max(-0.9, Math.min(0.9, -(pointer.current.y / Math.max(1, window.innerHeight) - 0.5)));
      gl.uniform2f(u.res, w, h);
      gl.uniform1f(u.time, clock.current);
      gl.uniform2f(u.mouse, mx, my);
      gl.uniform1f(u.light, lightRef.current ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce && visible) clock.current += dt;
      if (visible) {
        const back = 1 - front.current;
        if (fading.current) {
          fade.current = Math.min(1, fade.current + dt / FADE_SECONDS);
          if (layerRefs[back].current) layerRefs[back].current!.style.opacity = String(fade.current);
          draw(layers.current[front.current]);
          draw(layers.current[back]);
          if (fade.current >= 1) {
            fading.current = false;
            if (layerRefs[front.current].current) layerRefs[front.current].current!.style.opacity = "0";
            layers.current[front.current] = null;
            front.current = back;
          }
        } else {
          draw(layers.current[front.current]);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <canvas ref={layerRef0} className="absolute inset-0 block h-full w-full" />
      <canvas ref={layerRef1} className="absolute inset-0 block h-full w-full" style={{ opacity: 0 }} />
    </div>
  );
}
