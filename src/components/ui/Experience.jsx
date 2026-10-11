import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */
const WORD = "Experience";
const TOTAL = WORD.length; // one strike forges one letter

// The forge is drawn in a 600 x 400 space. The viewBox is wider than that, so the
// brick wall, floor and glow can fade out into the page instead of ending at a box edge.
const VB_X = -200;
const VB_Y = -50;
const VB_W = 1000;
const VB_H = 470;

const IMPACT = { x: 310, y: 235 }; // where the hammer face meets the metal
const BUCKET = { x: 625, y: 322 };
const PIVOT = { x: 490, y: 212 }; // hammer grip
const ORIGIN = `${PIVOT.x} ${PIVOT.y}`;
const BAR_ORIGIN = `${IMPACT.x} 251`;
const ANVIL = { top: 251, left: 150, right: 440 };

const REST_ANGLE = 58; // raised hammer angle
const WINDUP_ANGLE = 64; // a touch higher before every strike
const LOOP_DELAY = 4500; // ms to wait before the animation replays
const BAR_MIN = 0.85;
const BAR_MAX = 1.15;

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
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };

  const noiseBuffer = (c, seconds, decay = true) => {
    const len = Math.floor(c.sampleRate * seconds);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (decay ? 1 - i / len : 1);
    return buf;
  };

  return {
    /** try to start audio – returns true if sound can play */
    unlock: () => !!ensure(),

    setMuted(m) {
      muted = m;
      if (ctx && master) master.gain.setTargetAtTime(m ? 0 : 0.7, ctx.currentTime, 0.02);
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

    /** hot metal hitting water */
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
      g.gain.exponentialRampToValueAtTime(0.35, t + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0005, t + 1.5);
      n.connect(bp).connect(g).connect(master);
      n.start(t);
      return true;
    },

    close() {
      if (ctx) ctx.close();
      ctx = null;
    },
  };
}

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
  const flashRef = useRef(null);
  const canvasRef = useRef(null);
  const hammerRef = useRef(null);
  const ghost1Ref = useRef(null);
  const ghost2Ref = useRef(null);
  const anvilRef = useRef(null);
  const barRef = useRef(null);
  const heatRef = useRef(null);
  const glowRef = useRef(null);
  const wallGlowRef = useRef(null);
  const ringRef = useRef(null);
  const furnaceRef = useRef(null);
  const furnaceGlowRef = useRef(null);
  const rippleRef = useRef(null);

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

  const [strikes, setStrikes] = useState(0);
  const [done, setDone] = useState(false);
  const [soundOn, setSoundOn] = useState(true); // sound is ON by default
  const [locked, setLocked] = useState(false); // browser is blocking audio
  const [toast, setToast] = useState("");
  const isLight = useIsLight();

  const inView = useInView(sectionRef, { amount: 0.35 });
  inViewRef.current = inView;
  lockedRef.current = locked;

  const getAudio = () => {
    if (!audioRef.current) audioRef.current = createForgeAudio();
    return audioRef.current;
  };

  /* ---------- spawn sparks / steam / flashes in scene coordinates ---------- */
  const burst = useCallback((kind, count, at = IMPACT) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const s = r.width / VB_W;
    const x = ((at.x - VB_X) / VB_W) * r.width;
    const y = ((at.y - VB_Y) / VB_H) * r.height;

    if (kind === "flash") {
      particles.current.push({ kind, x, y, r: 150 * s, life: 0, max: 0.24 });
      return;
    }

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
    let emberAcc = 0;
    let g1 = REST_ANGLE;
    let g2 = REST_ANGLE;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = r.width;
      h = r.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!inViewRef.current) return;

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
      const s = w / VB_W;
      const px = (u) => ((u - VB_X) / VB_W) * w;
      const py = (u) => ((u - VB_Y) / VB_H) * h;
      const floor = py(ANVIL.top);
      const anvilL = px(ANVIL.left);
      const anvilR = px(ANVIL.right);

      // ambient embers: mostly rising off the furnace, some drifting across the room
      let embers = 0;
      for (let i = 0; i < list.length; i++) if (list[i].kind === "ember") embers++;
      emberAcc += dt;
      while (emberAcc > 0.1 && embers < 46) {
        emberAcc -= 0.1;
        embers++;
        const nearFurnace = Math.random() < 0.55;
        list.push({
          kind: "ember",
          x: nearFurnace ? px(-40 + Math.random() * 80) : px(-120 + Math.random() * 840),
          y: nearFurnace ? py(190 + Math.random() * 120) : py(270 + Math.random() * 110),
          vx: (Math.random() - 0.5) * 10 * s,
          vy: -(22 + Math.random() * 40) * s,
          phase: Math.random() * Math.PI * 2,
          size: (0.8 + Math.random() * 1.6) * Math.max(s, 0.7),
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
        } else if (p.kind === "flash") {
          // a quick burst of light right at the point of impact
          const gr = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          gr.addColorStop(0, `rgba(255,232,180,${k * 0.55})`);
          gr.addColorStop(1, "rgba(255,120,20,0)");
          c.globalCompositeOperation = "lighter";
          c.fillStyle = gr;
          c.beginPath();
          c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
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

  /* ---------- one hammer strike lands ---------- */
  const impact = useCallback(
    (i) => {
      const power = 0.85 + Math.random() * 0.3;
      if (soundRef.current) {
        const ok = getAudio().strike(power);
        setLocked(!ok);
      }

      burst("flash", 1);
      burst("spark", 30 + Math.floor(Math.random() * 16));

      // the iron gets a little hotter overall as the work goes on
      const level = (i + 1) / TOTAL;

      // metal flares white-hot, then settles to a glowing orange
      gsap.fromTo(heatRef.current, { opacity: 1 }, { opacity: 0.45 + 0.2 * level, duration: 0.9, ease: "power2.out", overwrite: true });
      gsap.fromTo(glowRef.current, { opacity: 0.95 }, { opacity: 0.3 + 0.15 * level, duration: 0.9, ease: "power2.out", overwrite: true });
      gsap.to(wallGlowRef.current, { opacity: 0.3 + 0.5 * level, duration: 0.5, ease: "power2.out", overwrite: true });

      // the bar flattens and is drawn out a little longer with every strike
      const prev = BAR_MIN + ((BAR_MAX - BAR_MIN) * i) / TOTAL;
      const next = BAR_MIN + ((BAR_MAX - BAR_MIN) * (i + 1)) / TOTAL;
      gsap.fromTo(
        barRef.current,
        { scaleY: 0.68, scaleX: prev },
        { scaleY: 1, scaleX: next, duration: 0.6, ease: "elastic.out(1, 0.45)", svgOrigin: BAR_ORIGIN, overwrite: true }
      );

      // anvil + scene recoil, settling like a spring instead of a hard wobble
      gsap.fromTo(anvilRef.current, { y: 3.5 }, { y: 0, duration: 0.5, ease: "elastic.out(1, 0.25)", overwrite: true });
      gsap.fromTo(
        sceneRef.current,
        { y: 2.5 * power, x: (Math.random() - 0.5) * 2 },
        { y: 0, x: 0, duration: 0.55, ease: "elastic.out(1, 0.3)", overwrite: true }
      );

      // shock ring + room flash
      gsap.fromTo(
        ringRef.current,
        { attr: { r: 8 }, opacity: 0.9 },
        { attr: { r: 90 }, opacity: 0, duration: 0.6, ease: "power2.out", overwrite: true }
      );
      gsap.fromTo(flashRef.current, { opacity: 1 }, { opacity: 0, duration: 0.8, ease: "power2.out", overwrite: true });

      setStrikes(i + 1);
    },
    [burst]
  );

  /* ---------- the metal goes into the water ---------- */
  const finish = useCallback(() => {
    if (soundRef.current) {
      const ok = getAudio().quench();
      setLocked(!ok);
    }
    burst("smoke", 12);
    burst("smoke", 10, BUCKET);
    gsap.fromTo(
      rippleRef.current,
      { attr: { rx: 6, ry: 1.5 }, opacity: 0.8 },
      { attr: { rx: 34, ry: 6 }, opacity: 0, duration: 1.1, ease: "power2.out" }
    );
    gsap.to(heatRef.current, { opacity: 0, duration: 1.4, ease: "power2.inOut", overwrite: true });
    gsap.to(glowRef.current, { opacity: 0, duration: 1.4, ease: "power2.inOut", overwrite: true });
    gsap.to(wallGlowRef.current, { opacity: 0.25, duration: 1.6, ease: "power2.inOut", overwrite: true });
    setDone(true);
  }, [burst]);

  /* ---------- the swing timeline ---------- */
  const runSequence = useCallback(() => {
    tlRef.current?.kill();
    particles.current = particles.current.filter((p) => p.kind === "ember");

    gsap.killTweensOf([barRef.current, heatRef.current, glowRef.current, wallGlowRef.current]);
    gsap.set(hammerRef.current, { rotation: REST_ANGLE, svgOrigin: ORIGIN });
    gsap.set(barRef.current, { scaleX: BAR_MIN, scaleY: 1, svgOrigin: BAR_ORIGIN });
    gsap.set([heatRef.current, glowRef.current], { opacity: 0 });
    gsap.to(wallGlowRef.current, { opacity: 0.2, duration: 0.8, ease: "power2.out" });
    setStrikes(0);
    setDone(false);

    const hammer = hammerRef.current;
    const tl = gsap.timeline({ delay: 0.5 });
    for (let i = 0; i < TOTAL; i++) {
      const raise = Math.max(0.24, 0.6 - i * 0.04); // the rhythm picks up
      const drop = Math.max(0.1, 0.15 - i * 0.006); // and the blows land harder
      tl.to(hammer, { rotation: WINDUP_ANGLE, duration: raise, ease: "power2.inOut" })
        .to(hammer, { rotation: 0, duration: drop, ease: "power4.in" })
        .call(() => impact(i))
        .to(hammer, { rotation: 10, duration: 0.1, ease: "power2.out" }); // bounces off the metal
    }
    tl.to(hammer, { rotation: REST_ANGLE, duration: 0.9, ease: "power3.inOut" }).call(finish);
    tlRef.current = tl;
  }, [impact, finish]);

  /* ---------- initial pose + furnace flicker ---------- */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(hammerRef.current, { rotation: REST_ANGLE, svgOrigin: ORIGIN });
      gsap.set(barRef.current, { scaleX: BAR_MIN, svgOrigin: BAR_ORIGIN });
      gsap.set([heatRef.current, glowRef.current, ringRef.current, rippleRef.current], { opacity: 0 });
      gsap.set(wallGlowRef.current, { opacity: 0.2 });

      gsap.to(furnaceRef.current, {
        opacity: () => 0.65 + Math.random() * 0.35,
        duration: 0.14,
        repeat: -1,
        repeatRefresh: true,
        yoyo: true,
        ease: "none",
      });
      gsap.to(furnaceGlowRef.current, {
        opacity: () => 0.4 + Math.random() * 0.4,
        duration: 0.22,
        repeat: -1,
        repeatRefresh: true,
        yoyo: true,
        ease: "none",
      });
    });
    return () => ctx.revert();
  }, []);

  /* ---------- first start: when scrolled into view ---------- */
  useEffect(() => {
    if (!inView || startedRef.current) return;
    startedRef.current = true;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      reduceRef.current = true;
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
        textShadow: [
          "0 0 34px rgba(255,170,60,1)",
          "0 0 18px rgba(255,120,20,0.7)",
          noGlow,
        ],
        y: [-12, 0, 0],
        scale: [1.14, 1, 1],
        transition: { duration: 1.3, times: [0, 0.2, 1], ease: "easeOut" },
      };
    }
    return { color: unlit, textShadow: noGlow, y: 0, scale: 1, transition: { duration: 0.6 } };
  };

  return (
    <Section id="experience" ref={sectionRef} aria-labelledby="experience-title">
      <Stage>
        <Flash ref={flashRef} aria-hidden="true" />

        <Title id="experience-title" aria-label={WORD}>
          {WORD.split("").map((ch, i) => (
            <Letter key={i} aria-hidden="true" initial={false} animate={letterAnim(i)}>
              {ch}
            </Letter>
          ))}
        </Title>

        <Scene ref={sceneRef}>
          <svg
            viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
            role="img"
            aria-label="A hammer striking a glowing bar of metal on an anvil in a forge"
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
              <linearGradient id="exp-fire" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#ff4d00" />
                <stop offset="0.6" stopColor="#ff9a2e" />
                <stop offset="1" stopColor="#ffe28a" />
              </linearGradient>
              <linearGradient id="exp-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3d6a82" />
                <stop offset="1" stopColor="#1c3342" />
              </linearGradient>
              <linearGradient id="exp-floor" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.09" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>

              {/* soft light pools: gradients instead of blur filters, so they animate smoothly */}
              <radialGradient id="exp-glow">
                <stop offset="0" stopColor="#ff7a1a" stopOpacity="0.95" />
                <stop offset="0.45" stopColor="#ff5a00" stopOpacity="0.38" />
                <stop offset="1" stopColor="#ff4d00" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="exp-shadow">
                <stop offset="0" stopColor="#000" stopOpacity="0.7" />
                <stop offset="1" stopColor="#000" stopOpacity="0" />
              </radialGradient>

              {/* the brick wall melts into the page at every edge */}
              <radialGradient id="exp-fade">
                <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
                <stop offset="0.55" stopColor="#fff" stopOpacity="0.5" />
                <stop offset="1" stopColor="#000" />
              </radialGradient>
              <mask id="exp-wall" maskUnits="userSpaceOnUse" x={VB_X} y={VB_Y} width={VB_W} height={VB_H}>
                <rect x={VB_X} y={VB_Y} width={VB_W} height={VB_H} fill="url(#exp-fade)" />
              </mask>
              <pattern id="exp-bricks" width="60" height="28" patternUnits="userSpaceOnUse">
                <path
                  d="M0 .5H60M0 14.5H60M30 0V14M0 14V28M60 14V28"
                  fill="none"
                  style={{ stroke: "var(--exp-brick)" }}
                />
              </pattern>

              {/* hammer shape, reused by the real hammer and its motion trail */}
              <g id="exp-hammer">
                <rect x="340" y="207" width="172" height="10" rx="5" fill="url(#exp-wood)" />
                <rect x="275" y="189" width="70" height="46" rx="6" fill="url(#exp-steel)" />
                <rect x="275" y="189" width="70" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
                <rect x="275" y="231" width="70" height="4" rx="2" fill="rgba(0,0,0,0.35)" />
                <rect x="330" y="199" width="14" height="26" rx="2" fill="#16181b" />
                <circle cx={PIVOT.x} cy={PIVOT.y} r="6" fill="#16181b" />
              </g>
            </defs>

            {/* brick wall */}
            <g mask="url(#exp-wall)">
              <rect x={VB_X} y={VB_Y} width={VB_W} height={VB_H} fill="url(#exp-bricks)" />
            </g>

            {/* warm light on the wall, grows as the work heats up */}
            <ellipse ref={wallGlowRef} cx="310" cy="235" rx="400" ry="210" fill="url(#exp-glow)" />

            {/* horizon line where wall meets floor */}
            <rect x={VB_X} y="380" width={VB_W} height="1.2" fill="url(#exp-floor)" />

            {/* tools hanging on the wall */}
            <g opacity="0.5" fill="none" stroke="#3a3f47" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M560 78 H730" />
              <path d="M582 78 V138 M582 138 L574 170 M582 138 L592 170" />
              <path d="M628 78 V150" />
              <rect x="617" y="150" width="22" height="13" rx="2" fill="#3a3f47" />
              <path d="M676 78 V132" />
              <path d="M663 132 H689 Q689 152 676 152 Q663 152 663 132 Z" fill="#3a3f47" />
              <path d="M712 78 V158" />
            </g>

            {/* furnace on the left */}
            <g transform="translate(-70 0)">
              <ellipse ref={furnaceGlowRef} cx="70" cy="262" rx="125" ry="135" fill="url(#exp-glow)" />
              <path
                d="M18 374 L18 212 Q18 168 70 168 Q122 168 122 212 L122 374 Z"
                fill="#171210"
                stroke="#2b211a"
                strokeWidth="2"
              />
              <path
                ref={furnaceRef}
                d="M42 374 L42 242 Q42 214 70 214 Q98 214 98 242 L98 374 Z"
                fill="url(#exp-fire)"
              />
            </g>

            {/* quench bucket */}
            <path
              d={`M${BUCKET.x - 30} 325 L${BUCKET.x + 30} 325 L${BUCKET.x + 23} 374 L${BUCKET.x - 23} 374 Z`}
              fill="#1d1f23"
              stroke="#33363c"
              strokeWidth="1.5"
            />
            <ellipse cx={BUCKET.x} cy="326" rx="30" ry="5" fill="url(#exp-water)" />
            <ellipse
              ref={rippleRef}
              cx={BUCKET.x}
              cy="326"
              rx="6"
              ry="1.5"
              fill="none"
              stroke="rgba(190,225,245,0.8)"
              strokeWidth="1.2"
            />

            {/* ground shadow */}
            <ellipse cx="310" cy="381" rx="380" ry="13" fill="url(#exp-shadow)" />

            {/* warm glow behind the metal */}
            <ellipse ref={glowRef} cx="310" cy="243" rx="190" ry="52" fill="url(#exp-glow)" />

            {/* wooden stump + anvil */}
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

            {/* the bar being forged */}
            <g ref={barRef}>
              <rect x="235" y="235" width="150" height="16" rx="2" fill="#2d3036" />
              <rect x="235" y="235" width="150" height="2.5" rx="1" fill="rgba(255,255,255,0.18)" />
              <rect ref={heatRef} x="235" y="235" width="150" height="16" rx="2" fill="url(#exp-heat)" />
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
const Section = styled.section`
  --exp-fg: var(--fg, #fafafa);
  --exp-muted: var(--muted, rgba(250, 250, 250, 0.6));
  --exp-line: rgba(255, 255, 255, 0.14);
  --exp-track: rgba(255, 255, 255, 0.1);
  --exp-brick: rgba(255, 255, 255, 0.06);

  [data-theme="light"] & {
    --exp-fg: var(--fg, #09090b);
    --exp-muted: var(--muted, rgba(0, 0, 0, 0.6));
    --exp-line: rgba(0, 0, 0, 0.16);
    --exp-track: rgba(0, 0, 0, 0.1);
    --exp-brick: rgba(0, 0, 0, 0.07);
  }

  position: relative;
  width: 100%;
  padding: clamp(64px, 9vw, 130px) 0 clamp(48px, 7vw, 100px);
  color: var(--exp-fg);

  /* a wide, soft pool of firelight that bleeds into the page with no edge */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      ellipse 52% 46% at 50% 66%,
      rgba(255, 110, 20, 0.1) 0%,
      rgba(255, 110, 20, 0.04) 45%,
      transparent 72%
    );
  }
`;

const Stage = styled.div`
  position: relative;
  width: min(1280px, 100% - 32px);
  margin: 0 auto;
  display: grid;
  justify-items: center;
  gap: clamp(8px, 2vw, 20px);
`;

const Flash = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  z-index: 1;
  background: radial-gradient(
    55% 48% at 50% 62%,
    rgba(255, 150, 50, 0.3),
    rgba(255, 150, 50, 0.08) 45%,
    transparent 70%
  );
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
  width: min(1120px, 100%, max(360px, calc((100vh - 260px) * ${VB_W / VB_H})));
  width: min(1120px, 100%, max(360px, calc((100svh - 260px) * ${VB_W / VB_H})));
  aspect-ratio: ${VB_W} / ${VB_H};

  svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }
`;

const Sparks = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
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