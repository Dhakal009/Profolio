import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */
const WORD = "Experience";
const TOTAL = WORD.length; // one strike forges one letter

// The forge is drawn in a 420-tall space and framed around the anvil.
const VB_X = 280;
const VB_W = 720;
const VB_H = 420;

const IMPACT = { x: 640, y: 235 }; // where the hammer face meets the metal
const PIVOT = { x: 820, y: 212 }; // hammer grip
const ORIGIN = `${PIVOT.x} ${PIVOT.y}`;
const BAR_ORIGIN = `${IMPACT.x} 251`;
const ANVIL = { top: 251, left: 480, right: 770 };

const REST_ANGLE = 58; // raised hammer angle
const WINDUP_ANGLE = 64; // a touch higher before every strike
const LOOP_DELAY = 4500; // ms to wait before the animation replays
const BAR_MIN = 0.85;
const BAR_MAX = 1.15;

// The spark canvas is bigger than the scene so sparks can fly past its edges.
const OV = { l: 0.14, r: 0.14, t: 0.35, b: 0.1 };

// A smith's rhythm: two light blows, one heavy. The very last blow is the biggest.
const powerAt = (i) => (i === TOTAL - 1 ? 1.5 : [0.8, 0.8, 1.15][i % 3]);

/* ------------------------------------------------------------------ */
/*  Forge sound – synthesized with the Web Audio API (no audio files)  */
/* ------------------------------------------------------------------ */
function createForgeAudio() {
  let ctx = null;
  let master = null;
  let muted = false;

  // Browsers only allow audio after the visitor has interacted with the page.
  const canStart = () =>
    !("userActivation" in navigator) || navigator.userActivation.hasBeenActive;

  // a generated "cave": noise that fades away, used as a reverb tail
  const makeImpulse = (c, seconds = 1.7, decay = 2.8) => {
    const len = Math.floor(c.sampleRate * seconds);
    const buf = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  };

  const noiseBuffer = (c, seconds, decay = true) => {
    const len = Math.floor(c.sampleRate * seconds);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (decay ? 1 - i / len : 1);
    return buf;
  };

  const ensure = () => {
    if (!ctx) {
      if (!canStart()) return null;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.7;

      // gentle compressor so overlapping rings never clip
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 18;
      comp.ratio.value = 6;
      comp.attack.value = 0.003;
      comp.release.value = 0.2;
      master.connect(comp);
      comp.connect(ctx.destination);

      // quiet reverb tail so every blow sounds like it landed in a big room
      const verb = ctx.createConvolver();
      verb.buffer = makeImpulse(ctx);
      const wet = ctx.createGain();
      wet.gain.value = 0.22;
      master.connect(wet);
      wet.connect(verb);
      verb.connect(comp);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };

  return {
    /** try to start audio – returns true if sound can play */
    unlock: () => !!ensure(),

    setMuted(m) {
      muted = m;
      if (ctx && master) master.gain.setTargetAtTime(m ? 0 : 0.7, ctx.currentTime, 0.02);
    },

    /** the hammer cutting through the air just before it lands */
    whoosh(dur = 0.14) {
      const c = ensure();
      if (!c) return false;
      const t = c.currentTime;
      const n = c.createBufferSource();
      n.buffer = noiseBuffer(c, Math.max(0.1, dur), false);
      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = 1.2;
      bp.frequency.setValueAtTime(500, t);
      bp.frequency.exponentialRampToValueAtTime(2600, t + dur);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.1, t + dur * 0.85);
      g.gain.exponentialRampToValueAtTime(0.0005, t + dur + 0.04);
      n.connect(bp).connect(g).connect(master);
      n.start(t);
      return true;
    },

    /** returns false when the browser still blocks audio */
    strike(intensity = 1) {
      const c = ensure();
      if (!c) return false;
      const t = c.currentTime;

      // low body thud
      const osc = c.createOscillator();
      const g = c.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(170, t);
      osc.frequency.exponentialRampToValueAtTime(42, t + 0.16);
      g.gain.setValueAtTime(0.9 * intensity, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + 0.25);

      // heavy blows get a deep boom underneath
      if (intensity > 1.05) {
        const bo = c.createOscillator();
        const bg = c.createGain();
        bo.type = "sine";
        bo.frequency.setValueAtTime(96, t);
        bo.frequency.exponentialRampToValueAtTime(28, t + 0.5);
        bg.gain.setValueAtTime(0.6 * (intensity - 0.9), t);
        bg.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        bo.connect(bg).connect(master);
        bo.start(t);
        bo.stop(t + 0.65);
      }

      // sharp metallic transient
      const n = c.createBufferSource();
      n.buffer = noiseBuffer(c, 0.07);
      const hp = c.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 1800;
      const ng = c.createGain();
      ng.gain.value = 0.65 * intensity;
      n.connect(hp).connect(ng).connect(master);
      n.start(t);

      // ringing anvil – inharmonic partials with a slow decay
      [830, 1370, 2110, 3090].forEach((f, i) => {
        const o = c.createOscillator();
        const og = c.createGain();
        o.type = "sine";
        o.frequency.value = f * (1 + (Math.random() - 0.5) * 0.025);
        og.gain.setValueAtTime((0.2 / (i + 1)) * intensity, t);
        og.gain.exponentialRampToValueAtTime(0.0005, t + 1.1 + 0.4 / (i + 1));
        o.connect(og).connect(master);
        o.start(t);
        o.stop(t + 1.7);
      });
      return true;
    },

    /** the hot plate hissing as it cools */
    quench() {
      const c = ensure();
      if (!c) return false;
      const t = c.currentTime;
      const n = c.createBufferSource();
      n.buffer = noiseBuffer(c, 1.6, false);
      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = 0.8;
      bp.frequency.setValueAtTime(2500, t);
      bp.frequency.exponentialRampToValueAtTime(7000, t + 1.4);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 1.5);
      n.connect(bp).connect(g).connect(master);
      n.start(t);
      return true;
    },

    /** a soft rising charge as the forge goes cool and bright */
    powerUp() {
      const c = ensure();
      if (!c) return false;
      const t = c.currentTime;
      const o = c.createOscillator();
      const lp = c.createBiquadFilter();
      const g = c.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(70, t);
      o.frequency.exponentialRampToValueAtTime(420, t + 1.2);
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(300, t);
      lp.frequency.exponentialRampToValueAtTime(2400, t + 1.2);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.08, t + 1.0);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 1.9);
      o.connect(lp).connect(g).connect(master);
      o.start(t);
      o.stop(t + 2);
      return true;
    },

    close() {
      if (ctx) ctx.close();
      ctx = null;
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Firelight shader (ogl): a soft pool of heat around the anvil that  */
/*  swells with every blow, plus a shock ring on impact                */
/* ------------------------------------------------------------------ */
const VERT = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec2 uRes;
  uniform vec2 uAnvil;
  uniform float uTime;
  uniform float uHeat;
  uniform float uPulse;
  uniform float uPulseT;
  uniform float uCool;
  uniform float uGain;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float asp = uRes.x / uRes.y;
    vec2 p = (vUv - uAnvil) * vec2(asp, 1.0);
    float d = length(p * vec2(0.8, 1.15));

    // slowly drifting heat haze
    float n = fbm(p * vec2(2.2, 1.6) + vec2(0.0, -uTime * 0.18));
    float pool = exp(-d * 3.4) * (0.25 + 0.75 * uHeat);
    float haze = pool * (0.55 + 0.9 * n);

    // the flash of a blow, and the ring that leaves it
    float flash = uPulse * exp(-d * 7.0);
    float q = (d - uPulseT * 0.85) * 16.0;
    float ring = exp(-q * q) * uPulse * exp(-uPulseT * 2.2);

    vec3 warm = vec3(1.0, 0.40, 0.07);
    vec3 hot = vec3(1.0, 0.80, 0.48);
    vec3 cool = vec3(0.50, 0.78, 1.0);
    vec3 col = mix(warm, hot, clamp(flash * 1.6 + pool * 0.6, 0.0, 1.0));
    col = mix(col, cool, uCool);

    float a = (haze * 0.42 + flash * 0.55 + ring * 0.35) * uGain;

    // melt into the page on every side so there is never an edge
    float edge = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x)
               * smoothstep(0.0, 0.10, vUv.y) * smoothstep(1.0, 0.86, vUv.y);
    a *= edge;

    gl_FragColor = vec4(col * a, a);
  }
`;

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */
const SpeakerOn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
  </svg>
);
const SpeakerOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="m22 9-6 6" />
    <path d="m16 9 6 6" />
  </svg>
);

/** follows the site's [data-theme='light'] switch so the letters stay readable */
function useIsLight() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setLight(
        root.getAttribute("data-theme") === "light" ||
          document.body?.getAttribute("data-theme") === "light"
      );
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    if (document.body) mo.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  return light;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Experience() {
  const sectionRef = useRef(null);
  const sceneRef = useRef(null);
  const glHostRef = useRef(null);
  const canvasRef = useRef(null);
  const hammerRef = useRef(null);
  const ghost1Ref = useRef(null);
  const ghost2Ref = useRef(null);
  const anvilRef = useRef(null);
  const barRef = useRef(null);
  const heatRef = useRef(null);
  const glowRef = useRef(null);
  const ringRef = useRef(null);

  const particles = useRef([]);
  const tlRef = useRef(null);
  const audioRef = useRef(null);
  const soundRef = useRef(true);
  const startedRef = useRef(false);
  const reduceRef = useRef(false);
  const inViewRef = useRef(false);
  const lockedRef = useRef(false);
  const pressLockedRef = useRef(false);
  const toastTimer = useRef(0);
  const glGainRef = useRef(1);

  // light-and-heat state, tweened by GSAP and read by the shader
  const fx = useRef({ heat: 0.12, pulse: 0, pulseT: 1, cool: 0 });

  const [strikes, setStrikes] = useState(0);
  const [done, setDone] = useState(false);
  const [soundOn, setSoundOn] = useState(true); // sound is ON by default
  const [locked, setLocked] = useState(false); // browser is blocking audio
  const [toast, setToast] = useState("");
  const isLight = useIsLight();

  const inView = useInView(sectionRef, { amount: 0.35 });
  inViewRef.current = inView;
  lockedRef.current = locked;
  glGainRef.current = isLight ? 0.6 : 1;

  const getAudio = () => {
    if (!audioRef.current) audioRef.current = createForgeAudio();
    return audioRef.current;
  };

  /* ---------- spawn sparks / steam in scene coordinates ---------- */
  const burst = useCallback((kind, count, at = IMPACT) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sceneW = canvas.offsetWidth / (1 + OV.l + OV.r);
    const s = sceneW / VB_W;
    const x = OV.l * sceneW + (at.x - VB_X) * s;
    const y = OV.t * (VB_H * s) + at.y * s;

    for (let i = 0; i < count; i++) {
      if (kind === "spark") {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.55;
        const sp = (220 + Math.random() * 430) * s;
        particles.current.push({
          kind,
          x: x + (Math.random() - 0.5) * 34 * s,
          y: y - 4,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          hit: 0,
          life: 0,
          max: 0.5 + Math.random() * 0.7,
          size: (1 + Math.random() * 1.8) * Math.max(s, 0.7),
        });
      } else if (kind === "smoke") {
        particles.current.push({
          kind,
          x: x + (Math.random() - 0.5) * 70 * s,
          y: y - 4 + Math.random() * 10,
          vx: (Math.random() - 0.5) * 18 * s,
          vy: -(30 + Math.random() * 45) * s,
          r: (8 + Math.random() * 10) * s,
          life: 0,
          max: 1.6 + Math.random() * 1.4,
        });
      }
    }
  }, []);

  /* ---------- canvas loop: sparks, steam, embers, hammer motion trail ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");
    let raf;
    let last = performance.now();
    let w = 0;
    let h = 0;
    let s = 1; // scene pixels per scene unit
    let ox = 0;
    let oy = 0;
    let emberAcc = 0;
    let g1 = REST_ANGLE;
    let g2 = REST_ANGLE;

    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sceneW = w / (1 + OV.l + OV.r);
      s = sceneW / VB_W;
      ox = OV.l * sceneW;
      oy = OV.t * (VB_H * s);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!inViewRef.current || !w) return;

      // hammer motion-blur ghosts lag behind the real hammer
      if (hammerRef.current) {
        const cur = gsap.getProperty(hammerRef.current, "rotation") || 0;
        g1 += (cur - g1) * 0.38;
        g2 += (cur - g2) * 0.2;
        const o1 = Math.min(0.42, Math.abs(cur - g1) / 26);
        const o2 = Math.min(0.24, Math.abs(cur - g2) / 40);
        ghost1Ref.current?.setAttribute("transform", `rotate(${g1} ${PIVOT.x} ${PIVOT.y})`);
        ghost2Ref.current?.setAttribute("transform", `rotate(${g2} ${PIVOT.x} ${PIVOT.y})`);
        ghost1Ref.current?.setAttribute("opacity", o1 > 0.02 ? o1 : 0);
        ghost2Ref.current?.setAttribute("opacity", o2 > 0.02 ? o2 : 0);
      }

      c.clearRect(0, 0, w, h);
      const list = particles.current;
      const px = (u) => ox + (u - VB_X) * s;
      const py = (u) => oy + u * s;
      const floor = py(ANVIL.top);
      const anvilL = px(ANVIL.left);
      const anvilR = px(ANVIL.right);

      // a few embers drifting up through the room
      let embers = 0;
      for (let i = 0; i < list.length; i++) if (list[i].kind === "ember") embers++;
      emberAcc += dt;
      while (emberAcc > 0.14 && embers < 26) {
        emberAcc -= 0.14;
        embers++;
        list.push({
          kind: "ember",
          x: px(480 + Math.random() * 360),
          y: py(280 + Math.random() * 100),
          vx: (Math.random() - 0.5) * 10 * s,
          vy: -(22 + Math.random() * 40) * s,
          phase: Math.random() * Math.PI * 2,
          size: (0.8 + Math.random() * 1.5) * Math.max(s, 0.7),
          life: 0,
          max: 2.6 + Math.random() * 2.4,
        });
      }
      if (emberAcc > 0.5) emberAcc = 0;

      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.life += dt;
        if (p.life >= p.max) {
          list.splice(i, 1);
          continue;
        }
        const k = 1 - p.life / p.max;

        if (p.kind === "spark") {
          p.vy += 900 * s * dt;
          p.vx *= 1 - 0.7 * dt; // a little air drag
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          // sparks skip off the anvil face
          if (p.vy > 0 && p.y >= floor && p.x > anvilL && p.x < anvilR && p.hit < 2) {
            p.y = floor;
            p.vy *= -0.36;
            p.vx *= 0.75;
            p.hit++;
          }
          c.globalCompositeOperation = "lighter";
          // soft halo + hot core
          c.strokeStyle = `rgba(255,120,30,${k * 0.35})`;
          c.lineWidth = p.size * k * 3 + 1;
          c.beginPath();
          c.moveTo(p.x, p.y);
          c.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03);
          c.stroke();
          c.strokeStyle = `rgba(255,${Math.floor(150 + 100 * k)},${Math.floor(60 * k)},${k})`;
          c.lineWidth = p.size * k + 0.4;
          c.stroke();
        } else if (p.kind === "ember") {
          p.phase += dt * 3;
          p.x += (p.vx + Math.sin(p.phase) * 14 * s) * dt;
          p.y += p.vy * dt;
          const flicker = 0.6 + 0.4 * Math.sin(p.phase * 2.3);
          const a = Math.sin(Math.PI * Math.min(1, p.life / p.max)) * flicker * 0.8;
          c.globalCompositeOperation = "lighter";
          c.fillStyle = `rgba(255,${Math.floor(110 + 70 * flicker)},40,${a})`;
          c.beginPath();
          c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          c.fill();
        } else {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.r += dt * 26;
          c.globalCompositeOperation = "source-over";
          c.fillStyle = `rgba(210,210,215,${0.16 * k})`;
          c.beginPath();
          c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          c.fill();
        }
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  /* ---------- WebGL firelight (ogl). If WebGL is missing, the page simply goes without. ---------- */
  useEffect(() => {
    const host = glHostRef.current;
    if (!host) return;

    let renderer;
    let raf;
    let ro;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: false, dpr: 0.6 });
    } catch (e) {
      return;
    }
    const gl = renderer.gl;
    if (!gl) return;
    gl.clearColor(0, 0, 0, 0);
    host.appendChild(gl.canvas);
    gl.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blendFunc: { src: gl.ONE, dst: gl.ONE_MINUS_SRC_ALPHA },
      uniforms: {
        uRes: { value: [1, 1] },
        uAnvil: { value: [0.6, 0.4] },
        uTime: { value: 0 },
        uHeat: { value: 0.12 },
        uPulse: { value: 0 },
        uPulseT: { value: 1 },
        uCool: { value: 0 },
        uGain: { value: 1 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const u = program.uniforms;

    // keep the glow centred on the point where the hammer lands
    const resize = () => {
      const r = host.getBoundingClientRect();
      if (!r.width || !r.height) return;
      renderer.setSize(r.width, r.height);
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      u.uRes.value = [r.width, r.height];
      const sc = sceneRef.current;
      if (sc) {
        const sw = sc.offsetWidth;
        const sh = sc.offsetHeight;
        const sr = sc.getBoundingClientRect();
        const left = sr.left - r.left + sr.width / 2 - sw / 2;
        const top = sr.top - r.top + sr.height / 2 - sh / 2;
        u.uAnvil.value = [
          (left + ((IMPACT.x - VB_X) / VB_W) * sw) / r.width,
          1 - (top + (IMPACT.y / VB_H) * sh) / r.height,
        ];
      }
    };
    resize();
    ro = new ResizeObserver(resize);
    ro.observe(host);
    document.fonts?.ready?.then(resize);

    let last = performance.now();
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!inViewRef.current) return;

      const f = fx.current;
      f.pulse *= Math.exp(-dt * 4.5);
      f.pulseT += dt;
      u.uTime.value = now / 1000;
      u.uHeat.value = f.heat;
      u.uPulse.value = f.pulse;
      u.uPulseT.value = f.pulseT;
      u.uCool.value = f.cool;
      u.uGain.value = glGainRef.current;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      gl.canvas.parentNode?.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  /* ---------- one hammer strike lands ---------- */
  const impact = useCallback(
    (i) => {
      const power = powerAt(i) * (0.95 + Math.random() * 0.1);
      if (soundRef.current) {
        const ok = getAudio().strike(power);
        setLocked(!ok);
      }

      burst("spark", Math.round(22 + 16 * power));

      // firelight: a flash and a ring, and the room stays a little warmer afterwards
      const level = (i + 1) / TOTAL;
      fx.current.pulse = Math.min(1.4, 0.5 + 0.5 * power);
      fx.current.pulseT = 0;
      gsap.to(fx.current, { heat: 0.25 + 0.6 * level, duration: 0.5, ease: "power2.out", overwrite: "auto" });

      // the plate flares white-hot, then settles to a glowing orange
      gsap.fromTo(heatRef.current, { opacity: 1 }, { opacity: 0.45 + 0.2 * level, duration: 0.9, ease: "power2.out", overwrite: true });
      gsap.fromTo(glowRef.current, { opacity: 0.95 }, { opacity: 0.3 + 0.15 * level, duration: 0.9, ease: "power2.out", overwrite: true });

      // the plate flattens and is drawn out a little longer with every strike
      const prev = BAR_MIN + ((BAR_MAX - BAR_MIN) * i) / TOTAL;
      const next = BAR_MIN + ((BAR_MAX - BAR_MIN) * (i + 1)) / TOTAL;
      gsap.fromTo(
        barRef.current,
        { scaleY: 0.68, scaleX: prev },
        { scaleY: 1, scaleX: next, duration: 0.6, ease: "elastic.out(1, 0.45)", svgOrigin: BAR_ORIGIN, overwrite: true }
      );

      // anvil recoils like a spring
      gsap.fromTo(anvilRef.current, { y: 3.5 * power }, { y: 0, duration: 0.5, ease: "elastic.out(1, 0.25)", overwrite: true });

      // the whole frame takes the punch: a tiny push-in around the point of impact
      gsap.fromTo(
        sceneRef.current,
        {
          scale: 1 + 0.01 * power,
          y: 3 * power,
          x: (Math.random() - 0.5) * 2 * power,
          transformOrigin: `${((IMPACT.x - VB_X) / VB_W) * 100}% ${(IMPACT.y / VB_H) * 100}%`,
        },
        { scale: 1, y: 0, x: 0, duration: 0.7, ease: "elastic.out(1, 0.35)", overwrite: true }
      );

      // shock ring
      gsap.fromTo(
        ringRef.current,
        { attr: { r: 8 }, opacity: 0.9 },
        { attr: { r: 90 }, opacity: 0, duration: 0.6, ease: "power2.out", overwrite: true }
      );

      setStrikes(i + 1);
    },
    [burst]
  );

  /* ---------- the plate cools ---------- */
  const finish = useCallback(() => {
    if (soundRef.current) {
      const a = getAudio();
      const ok = a.quench();
      a.powerUp();
      setLocked(!ok);
    }
    burst("smoke", 14, { x: IMPACT.x, y: IMPACT.y + 4 });
    gsap.to(heatRef.current, { opacity: 0, duration: 1.4, ease: "power2.inOut", overwrite: true });
    gsap.to(glowRef.current, { opacity: 0, duration: 1.4, ease: "power2.inOut", overwrite: true });
    gsap.to(fx.current, { heat: 0.4, cool: 1, duration: 1.6, ease: "power2.inOut", overwrite: "auto" });
    setDone(true);
  }, [burst]);

  /* ---------- the swing timeline ---------- */
  const runSequence = useCallback(() => {
    tlRef.current?.kill();
    particles.current = particles.current.filter((p) => p.kind === "ember");

    gsap.killTweensOf([barRef.current, heatRef.current, glowRef.current]);
    gsap.set(hammerRef.current, { rotation: REST_ANGLE, svgOrigin: ORIGIN });
    gsap.set(barRef.current, { scaleX: BAR_MIN, scaleY: 1, svgOrigin: BAR_ORIGIN });
    gsap.set([heatRef.current, glowRef.current], { opacity: 0 });

    // back to a dark room
    gsap.to(fx.current, { heat: 0.12, cool: 0, duration: 0.8, ease: "power2.inOut", overwrite: "auto" });

    setStrikes(0);
    setDone(false);

    const hammer = hammerRef.current;
    const tl = gsap.timeline({ delay: 0.5 });
    for (let i = 0; i < TOTAL; i++) {
      const last = i === TOTAL - 1;
      const raise = last ? 1.0 : Math.max(0.24, 0.6 - i * 0.04); // the rhythm picks up
      const drop = last ? 0.12 : Math.max(0.1, 0.15 - i * 0.006); // and the blows land harder
      const wind = WINDUP_ANGLE + (last ? 10 : 0);
      const hold = last ? 0.22 : powerAt(i) > 1 ? 0.08 : 0.04; // a freeze-frame on impact

      tl.to(hammer, { rotation: wind, duration: raise, ease: "power2.inOut" })
        .to({}, { duration: last ? 0.18 : 0.05 }) // a breath at the top
        .call(() => {
          if (soundRef.current) getAudio().whoosh(drop + 0.05);
        })
        .to(hammer, { rotation: 0, duration: drop, ease: "power4.in" })
        .call(() => impact(i))
        .to({}, { duration: hold })
        .to(hammer, { rotation: last ? 16 : 10, duration: 0.1, ease: "power2.out" }); // bounces off the metal
    }
    tl.to(hammer, { rotation: REST_ANGLE, duration: 0.9, ease: "power3.inOut" }).call(finish);
    tlRef.current = tl;
  }, [impact, finish]);

  /* ---------- initial pose ---------- */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(hammerRef.current, { rotation: REST_ANGLE, svgOrigin: ORIGIN });
      gsap.set(barRef.current, { scaleX: BAR_MIN, svgOrigin: BAR_ORIGIN });
      gsap.set([heatRef.current, glowRef.current, ringRef.current], { opacity: 0 });
    });
    return () => ctx.revert();
  }, []);

  /* ---------- first start: when scrolled into view ---------- */
  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      reduceRef.current = true;
      fx.current.heat = 0.4;
      fx.current.cool = 1;
      setStrikes(TOTAL);
      setDone(true);
      return;
    }
    runSequence();
  }, [inView, runSequence]);

  /* ---------- pause while off-screen, resume when back (keeps the sound quiet too) ---------- */
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (inView) tl.resume();
    else tl.pause();
  }, [inView]);

  /* ---------- replay 4.5s after finishing, only while the section is on screen ---------- */
  useEffect(() => {
    if (!done || !inView || reduceRef.current) return;
    const id = setTimeout(runSequence, LOOP_DELAY);
    return () => clearTimeout(id);
  }, [done, inView, runSequence]);

  /* ---------- if the browser blocks audio, the first click/tap/key unlocks it ---------- */
  useEffect(() => {
    if (!locked || !soundOn) return;
    const unlock = () => {
      if (getAudio().unlock()) {
        setLocked(false);
        events.forEach((e) => window.removeEventListener(e, unlock));
      }
    };
    const events = ["pointerdown", "keydown", "touchend"];
    events.forEach((e) => window.addEventListener(e, unlock));
    return () => events.forEach((e) => window.removeEventListener(e, unlock));
  }, [locked, soundOn]);

  /* ---------- cleanup ---------- */
  useEffect(
    () => () => {
      tlRef.current?.kill();
      gsap.killTweensOf(fx.current);
      audioRef.current?.close();
      clearTimeout(toastTimer.current);
    },
    []
  );

  /* ---------- click anywhere on the scene to mute / unmute ---------- */
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1600);
  };

  // Remember whether audio was still blocked when the press started, so the very
  // click that unlocks the sound is not also treated as a "mute" click.
  const markPress = () => {
    pressLockedRef.current = lockedRef.current;
  };

  const toggleSound = () => {
    if (pressLockedRef.current) {
      pressLockedRef.current = false;
      showToast("Sound on");
      return;
    }
    const next = !soundRef.current;
    setSoundOn(next);
    soundRef.current = next;
    const audio = getAudio();
    audio.setMuted(!next);
    if (next) {
      const ok = audio.strike(0.7); // little preview so you hear it is back on
      setLocked(!ok);
    } else {
      setLocked(false);
    }
    showToast(next ? "Sound on" : "Sound off");
  };

  /* ---------- letter states ---------- */
  const settled = isLight ? "#09090b" : "#fafafa";
  const unlit = isLight ? "rgba(9,9,11,0.1)" : "rgba(250,250,250,0.1)";
  const noGlow = "0 0 0px rgba(255,120,20,0)";

  const letterAnim = (i) => {
    if (reduceRef.current && (done || strikes > i)) {
      return { color: settled, textShadow: noGlow, y: 0, scale: 1, transition: { duration: 0 } };
    }
    if (done) {
      // the finished word ripples with one last glow, left to right
      return {
        color: [null, "#ffd9a0", settled],
        textShadow: [null, "0 0 28px rgba(255,160,50,0.85)", noGlow],
        y: 0,
        scale: 1,
        transition: { duration: 1.1, delay: 0.05 * i, times: [0, 0.45, 1], ease: "easeInOut" },
      };
    }
    if (strikes > i) {
      // struck: white-hot, glows orange, then cools to the page colour
      return {
        color: ["#fff4d6", "#ff9a2e", settled],
        textShadow: ["0 0 34px rgba(255,170,60,1)", "0 0 18px rgba(255,120,20,0.7)", noGlow],
        y: [-12, 0, 0],
        scale: [1.14, 1, 1],
        transition: { duration: 1.3, times: [0, 0.2, 1], ease: "easeOut" },
      };
    }
    return { color: unlit, textShadow: noGlow, y: 0, scale: 1, transition: { duration: 0.6 } };
  };

  return (
    <Section id="experience" ref={sectionRef} aria-labelledby="experience-title">
      <GlHost ref={glHostRef} aria-hidden="true" />

      <Stage>
        <Title id="experience-title" aria-label={WORD}>
          {WORD.split("").map((ch, i) => (
            <Letter key={i} aria-hidden="true" initial={false} animate={letterAnim(i)}>
              {ch}
            </Letter>
          ))}
        </Title>

        <Scene ref={sceneRef}>
          <svg
            viewBox={`${VB_X} 0 ${VB_W} ${VB_H}`}
            role="img"
            aria-label="A hammer striking a glowing plate of metal on an anvil"
          >
            <defs>
              <linearGradient id="exp-steel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#7a8089" />
                <stop offset="0.45" stopColor="#40444b" />
                <stop offset="1" stopColor="#202328" />
              </linearGradient>
              <linearGradient id="exp-wood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#a56d3b" />
                <stop offset="1" stopColor="#5a391c" />
              </linearGradient>
              <linearGradient id="exp-heat" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#ff4d00" />
                <stop offset="0.5" stopColor="#ffe3a0" />
                <stop offset="1" stopColor="#ff4d00" />
              </linearGradient>
              <linearGradient id="exp-floor" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.1" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="exp-glow">
                <stop offset="0" stopColor="#ff7a1a" stopOpacity="0.95" />
                <stop offset="0.45" stopColor="#ff5a00" stopOpacity="0.38" />
                <stop offset="1" stopColor="#ff4d00" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="exp-shadow">
                <stop offset="0" stopColor="#000" stopOpacity="0.7" />
                <stop offset="1" stopColor="#000" stopOpacity="0" />
              </radialGradient>

              {/* hammer shape, reused by the real hammer and its motion trail */}
              <g id="exp-hammer">
                <rect x="670" y="207" width="172" height="10" rx="5" fill="url(#exp-wood)" />
                <rect x="605" y="189" width="70" height="46" rx="6" fill="url(#exp-steel)" />
                <rect x="605" y="189" width="70" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
                <rect x="605" y="231" width="70" height="4" rx="2" fill="rgba(0,0,0,0.35)" />
                <rect x="660" y="199" width="14" height="26" rx="2" fill="#16181b" />
                <circle cx={PIVOT.x} cy={PIVOT.y} r="6" fill="#16181b" />
              </g>
            </defs>

            {/* the floor, a single faint line */}
            <rect x={VB_X} y="380" width={VB_W} height="1.2" fill="url(#exp-floor)" />
            <ellipse cx="640" cy="381" rx="300" ry="12" fill="url(#exp-shadow)" />

            {/* warm glow under the metal */}
            <ellipse ref={glowRef} cx={IMPACT.x} cy="243" rx="200" ry="54" fill="url(#exp-glow)" />

            {/* stump + anvil */}
            <g transform="translate(330 0)">
              <rect x="205" y="358" width="210" height="18" rx="3" fill="url(#exp-wood)" />
              <rect x="205" y="358" width="210" height="3" fill="rgba(255,255,255,0.12)" />
              <g ref={anvilRef}>
                <rect x="190" y="345" width="240" height="15" rx="2" fill="#1b1d21" />
                <path
                  d="M150 251 L440 251 L440 275 L402 275 L386 300 L406 330 L406 345 L214 345 L214 330 L234 300 L224 275 L200 275 Q164 270 150 251 Z"
                  fill="url(#exp-steel)"
                />
                <rect x="190" y="251" width="250" height="3" fill="rgba(255,255,255,0.25)" />
                <path d="M236 300 L224 275 L200 275" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
              </g>
            </g>

            {/* the plate being forged */}
            <g ref={barRef}>
              <rect x="565" y="235" width="150" height="16" rx="2" fill="#2d3036" />
              <rect x="565" y="235" width="150" height="2.5" rx="1" fill="rgba(255,255,255,0.18)" />
              <rect ref={heatRef} x="565" y="235" width="150" height="16" rx="2" fill="url(#exp-heat)" />
            </g>

            <circle ref={ringRef} cx={IMPACT.x} cy={IMPACT.y} r="8" fill="none" stroke="#ffb15c" strokeWidth="2" />

            {/* hammer motion trail */}
            <use ref={ghost2Ref} href="#exp-hammer" opacity="0" />
            <use ref={ghost1Ref} href="#exp-hammer" opacity="0" />
            {/* the hammer – drawn in its strike pose, GSAP rotates it around the grip */}
            <g ref={hammerRef}>
              <use href="#exp-hammer" />
            </g>
          </svg>

          <Sparks ref={canvasRef} aria-hidden="true" />
        </Scene>

        <Status aria-live="polite">
          <Count>{done ? "Forged" : `Strike ${String(strikes).padStart(2, "0")} of ${TOTAL}`}</Count>
          <Track aria-hidden="true">
            <Fill style={{ transform: `scaleX(${strikes / TOTAL})` }} />
          </Track>
          <Note>
            {done
              ? "No job titles yet. Every project is another strike on the anvil."
              : "Experience is built one strike at a time."}
          </Note>
          {locked && soundOn && <Hint>Click anywhere to let the forge ring.</Hint>}
        </Status>

        {/* the whole card is the sound switch */}
        <SoundToggle
          type="button"
          onPointerDown={markPress}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") markPress();
          }}
          onClick={toggleSound}
          aria-pressed={!soundOn}
          aria-label={soundOn ? "Mute forge sound" : "Unmute forge sound"}
          title={soundOn ? "Click to mute" : "Click to unmute"}
        />
        <Indicator aria-hidden="true" data-on={soundOn}>
          {soundOn ? <SpeakerOn /> : <SpeakerOff />}
        </Indicator>
        <Toast role="status" data-show={!!toast}>
          {toast}
        </Toast>
      </Stage>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles – map the CSS variables to your site's theme tokens         */
/* ------------------------------------------------------------------ */
const Section = styled.div`
  --exp-fg: var(--fg, #fafafa);
  --exp-muted: var(--muted, rgba(250, 250, 250, 0.6));
  --exp-line: rgba(255, 255, 255, 0.14);
  --exp-track: rgba(255, 255, 255, 0.1);

  [data-theme="light"] & {
    --exp-fg: var(--fg, #09090b);
    --exp-muted: var(--muted, rgba(0, 0, 0, 0.6));
    --exp-line: rgba(0, 0, 0, 0.16);
    --exp-track: rgba(0, 0, 0, 0.1);
  }

  position: relative;
  width: 100%;
  padding: clamp(16px, 3vw, 48px) 0;
  color: var(--exp-fg);
  overflow-x: clip; /* the spark layer is wider than the scene; never cause a sideways scrollbar */
`;

/* the WebGL firelight fills the whole section and melts into the page at every edge */
const GlHost = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`;

const Stage = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  margin: 0 auto;
  display: grid;
  justify-items: center;
  gap: clamp(8px, 2vw, 20px);
`;

const Title = styled.h2`
  position: relative;
  z-index: 2;
  margin: 0;
  font-size: clamp(2.8rem, 10vw, 7.5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  display: flex;
  justify-content: center;
  user-select: none;
`;

const Letter = styled(motion.span)`
  display: inline-block;
  will-change: transform, color;
`;

const Scene = styled.div`
  position: relative;
  z-index: 2;
  width: min(880px, 100%, max(360px, calc((100vh - 260px) * ${VB_W / VB_H})));
  width: min(880px, 100%, max(360px, calc((100svh - 260px) * ${VB_W / VB_H})));
  aspect-ratio: ${VB_W} / ${VB_H};

  svg {
    position: absolute;
    inset: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }
`;

/* bigger than the scene so sparks can fly past its edges */
const Sparks = styled.canvas`
  position: absolute;
  z-index: 3;
  left: -${OV.l * 100}%;
  top: -${OV.t * 100}%;
  width: ${(1 + OV.l + OV.r) * 100}%;
  height: ${(1 + OV.t + OV.b) * 100}%;
  pointer-events: none;
`;

const Status = styled.div`
  position: relative;
  z-index: 2;
  width: min(520px, 100%);
  display: grid;
  gap: 10px;
  text-align: center;
`;

const Count = styled.span`
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  color: #ff9a2e;
`;

const Track = styled.div`
  height: 3px;
  border-radius: 3px;
  background: var(--exp-track);
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ff5a00, #ffd27a);
  transform-origin: left;
  transition: transform 0.25s ease-out;
`;

const Note = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: var(--exp-muted);
`;

const Hint = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #ff9a2e;
`;

/* invisible switch that covers the whole card */
const SoundToggle = styled.button`
  position: absolute;
  inset: -8px;
  z-index: 3;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 24px;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: 2px solid #ff9a2e;
    outline-offset: -2px;
  }
`;

/* tiny read-only speaker icon that shows the current state */
const Indicator = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 4;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid var(--exp-line);
  color: var(--exp-muted);
  pointer-events: none;
  opacity: 0.75;
  transition: opacity 0.2s, color 0.2s, border-color 0.2s;

  &[data-on="false"] {
    color: #ff9a2e;
    border-color: rgba(255, 154, 46, 0.45);
  }
  ${SoundToggle}:hover ~ & {
    opacity: 1;
    color: var(--exp-fg);
  }
  ${SoundToggle}:hover ~ &[data-on="false"] {
    color: #ff9a2e;
  }
`;

const Toast = styled.span`
  position: absolute;
  top: 17px;
  right: 54px;
  z-index: 4;
  font-size: 0.78rem;
  color: var(--exp-fg);
  pointer-events: none;
  opacity: 0;
  transform: translateX(6px);
  transition: opacity 0.25s, transform 0.25s;

  &[data-show="true"] {
    opacity: 1;
    transform: none;
  }
`;