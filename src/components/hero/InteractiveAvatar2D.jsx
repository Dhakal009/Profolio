import { useCallback, useEffect, useRef, useState } from 'react';
import './interactive-avatar.css';

const FIRST_GREETING = { text: 'Hey there! Welcome!', mood: 'happy' };

const GREETINGS_AND_JOKES = [
  { text: "Hi! I'm Bikash!", mood: 'happy' },
  { text: 'Welcome to my portfolio!', mood: 'happy' },
  { text: "Hey! Glad you're here!", mood: 'happy' },
  { text: 'Hello! Take a look around!', mood: 'happy' },
  { text: 'Good to see you!', mood: 'happy' },
  { text: 'Scroll down, the good stuff is below!', mood: 'smug' },
  { text: 'It works on my machine!', mood: 'smug' },
  { text: 'Dockerized and caffeinated!', mood: 'smug' },
  { text: 'I speak fluent JS & YAML.', mood: 'smug' },
  { text: 'Dark mode saves lives.', mood: 'tired' },
  { text: '404: Sleep not found.', mood: 'tired' },
  { text: 'Coffee in, clean code out.', mood: 'tired' },
  { text: 'CSS: Centering Since Sunrise.', mood: 'tired' },
  { text: 'No bugs, only surprise features!', mood: 'cheeky' },
  { text: 'Git push and pray? Never!', mood: 'cheeky' },
];

function shuffleLines(lines, avoidFirstText) {
  const arr = [...lines];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (avoidFirstText && arr.length > 1 && arr[0].text === avoidFirstText) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function InteractiveAvatar2D() {
  const stageRef = useRef(null);
  const torsoRef = useRef(null);
  const leftCollarRef = useRef(null);
  const rightCollarRef = useRef(null);
  const leftPocketFlapRef = useRef(null);
  const rightPocketFlapRef = useRef(null);
  const armsRef = useRef(null);
  const rightForearmRef = useRef(null);
  const leftHandRef = useRef(null);
  const finger1Ref = useRef(null);
  const finger2Ref = useRef(null);
  const finger3Ref = useRef(null);
  const neckRef = useRef(null);
  const headRef = useRef(null);
  const backHairRef = useRef(null);
  const earsRef = useRef(null);
  const faceFeaturesRef = useRef(null);
  const eyesGroupRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const leftEyelidRef = useRef(null);
  const rightEyelidRef = useRef(null);
  const leftBrowRef = useRef(null);
  const rightBrowRef = useRef(null);
  const mustacheRef = useRef(null);
  const chinBeardRef = useRef(null);
  const mouthRef = useRef(null);
  const smirkRef = useRef(null);
  const sadMouthRef = useRef(null);
  const talkMouthRef = useRef(null);
  const yawnMouthRef = useRef(null);
  const cheekGlowRef = useRef(null);
  const inViewRef = useRef(true);
  const sunglassesRef = useRef(null);
  const lensShineLeftRef = useRef(null);
  const lensShineRightRef = useRef(null);
  const frontHairRef = useRef(null);
  const bangLeftRef = useRef(null);
  const bangRightRef = useRef(null);

  const [shadesDown, setShadesDown] = useState(false);
  const [glintFlash, setGlintFlash] = useState(false);
  const [sparkleBurst, setSparkleBurst] = useState(false);
  const [brokeFx, setBrokeFx] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [hoverZone, setHoverZone] = useState('none'); // 'none' | 'face' | 'hair' | 'hand' | 'torso'
  const [hasInteracted, setHasInteracted] = useState(false);
  const [quip, setQuip] = useState('');
  const [quipVisible, setQuipVisible] = useState(false);

  const hovered = hoverZone !== 'none';
  const lineDeckRef = useRef([]);
  const hasGreetedOnceRef = useRef(false);
  const lastLineRef = useRef('');
  const quipTimerRef = useRef(null);
  const autoGreetTimerRef = useRef(null);
  const reactionResetTimerRef = useRef(null);
  const glintTimerRef = useRef(null);
  const sparkleTimerRef = useRef(null);
  const brokeTimerRef = useRef(null);
  const holdTimerRef = useRef(null);
  const comboRef = useRef({ count: 0, lastTs: 0 });
  const wiggleRef = useRef({ lastX: 0, lastDir: 0, flips: 0, lastFlipTs: 0, cooldownUntil: 0 });
  const dragRef = useRef({ active: false, moved: false, charged: false, startX: 0, startY: 0 });

  // Mutable animation state updated at 60fps without React re-renders
  const animRef = useRef({
    targetMx: 0,
    targetMy: 0,
    mx: 0,
    my: 0,
    shadesTarget: 0,
    shadesVal: 0,
    shadesVel: 0,
    faceHoverTarget: 0,
    faceHoverVal: 0,
    handHoverTarget: 0,
    handHoverVal: 0,
    hairHoverTarget: 0,
    hairHoverVal: 0,
    nodVal: 0,
    nodVel: 0,
    hairVal: 0,
    hairVel: 0,
    armVal: 0,
    armVel: 0,
    waveVal: 0,
    waveVel: 0,
    browTarget: 0,
    browVal: 0,
    hoverVal: 0,
    hoverTarget: 0,
    smileTarget: 0,
    smileVal: 0,
    blinkVal: 1,
    blinkTimer: 2.2,
    blinkPhase: 0,
    winkPhase: 0,
    winkVal: 1,
    talkRemaining: 0,
    talkOpen: 0,
    prevMx: 0,
    prevMy: 0,
    hairLagX: 0,
    hairLagY: 0,
    hairLagVx: 0,
    hairLagVy: 0,
    saccadeX: 0,
    saccadeY: 0,
    saccadeTargetX: 0,
    saccadeTargetY: 0,
    saccadeTimer: 1.6,
    dragX: 0,
    dragY: 0,
    dragVx: 0,
    dragVy: 0,
    dragTargetX: 0,
    dragTargetY: 0,
    shakeVal: 0,
    shakeVel: 0,
    leftPocketVal: 0,
    leftPocketVel: 0,
    rightPocketVal: 0,
    rightPocketVel: 0,
    brokeTarget: 0,
    brokeVal: 0,
    smugTarget: 0,
    smugVal: 0,
    tiredTarget: 0,
    tiredVal: 0,
    cheekyTarget: 0,
    cheekyVal: 0,
    yawnPhase: 0,
    yawnVal: 0,
    idleYawning: false,
    lastActiveTime: 0,
    time: 0,
  });

  useEffect(() => {
    animRef.current.shadesTarget = shadesDown ? 1 : 0;
  }, [shadesDown]);

  useEffect(() => {
    const s = animRef.current;
    s.hoverTarget = hoverZone !== 'none' ? 1 : 0;
    s.faceHoverTarget = hoverZone === 'face' ? 1 : 0;
    s.handHoverTarget = hoverZone === 'hand' ? 1 : 0;
    s.hairHoverTarget = hoverZone === 'hair' ? 1 : 0;
  }, [hoverZone]);

  const triggerGlint = useCallback(() => {
    setGlintFlash(false);
    requestAnimationFrame(() => {
      setGlintFlash(true);
    });
    if (glintTimerRef.current) clearTimeout(glintTimerRef.current);
    glintTimerRef.current = setTimeout(() => setGlintFlash(false), 600);
  }, []);

  const markActive = useCallback(() => {
    const s = animRef.current;
    s.lastActiveTime = s.time;
    // Immediately wake up from continuous idle yawning when mouse moves or user clicks
    if (s.idleYawning) {
      s.idleYawning = false;
      s.yawnPhase = 0;
      if (lastLineRef.current === '*yawn*...') {
        setQuipVisible(false);
      }
    }
  }, []);

  const scheduleExpressionReset = useCallback((durationMs) => {
    if (reactionResetTimerRef.current) clearTimeout(reactionResetTimerRef.current);
    reactionResetTimerRef.current = setTimeout(() => {
      const s = animRef.current;
      s.smugTarget = 0;
      s.tiredTarget = 0;
      s.cheekyTarget = 0;
      if (s.shadesTarget === 0) {
        s.browTarget = 0;
        s.smileTarget = 0;
      }
    }, durationMs);
  }, []);

  const showNextQuip = useCallback(
    (customText, customMood) => {
      let text = customText;
      let mood = customMood || 'happy';

      if (!text) {
        if (!hasGreetedOnceRef.current) {
          hasGreetedOnceRef.current = true;
          text = FIRST_GREETING.text;
          mood = FIRST_GREETING.mood;
        } else {
          if (lineDeckRef.current.length === 0) {
            lineDeckRef.current = shuffleLines(GREETINGS_AND_JOKES, lastLineRef.current);
          }
          const picked = lineDeckRef.current.pop();
          text = picked.text;
          mood = picked.mood;
        }
      }
      lastLineRef.current = text;

      // Apply distinct facial expression for each text mood
      const s = animRef.current;
      s.smugTarget = mood === 'smug' ? 1 : 0;
      s.tiredTarget = mood === 'tired' ? 1 : 0;
      s.cheekyTarget = mood === 'cheeky' ? 1 : 0;
      if (mood === 'happy') {
        s.smileTarget = 1;
        s.browTarget = 0.5;
      } else if (mood === 'smug') {
        s.smileTarget = 0.9;
        s.browTarget = 0.3;
        triggerGlint();
      } else if (mood === 'tired') {
        s.smileTarget = 0;
        s.browTarget = -0.35;
      } else if (mood === 'cheeky') {
        s.smileTarget = 1.15;
        s.browTarget = 0.95;
      }

      // Sync speaking mouth duration & bubble duration cleanly to phrase length
      const isYawn = mood === 'yawn';
      const talkSec = isYawn ? 0 : clamp(0.75 + text.length * 0.042, 0.9, 1.85);
      const bubbleMs = isYawn ? 2300 : Math.round(talkSec * 1000 + 1350);

      setQuip(text);
      setQuipVisible(true);
      s.talkRemaining = talkSec;
      if (!isYawn && mood !== 'broke') {
        scheduleExpressionReset(bubbleMs);
      }

      if (quipTimerRef.current) clearTimeout(quipTimerRef.current);
      if (!isYawn) {
        quipTimerRef.current = setTimeout(() => {
          setQuipVisible(false);
        }, bubbleMs);
      }

      // Reset the automatic chat bubble timer cleanly after this bubble finishes
      if (autoGreetTimerRef.current) clearTimeout(autoGreetTimerRef.current);
      if (!isYawn) {
        autoGreetTimerRef.current = setTimeout(() => {
          if (inViewRef.current && !document.hidden && !animRef.current.idleYawning) {
            animRef.current.nodVel += 1.6;
            animRef.current.waveVel += 3.6;
            showNextQuip();
          } else {
            const retry = () => {
              if (inViewRef.current && !document.hidden && !animRef.current.idleYawning) {
                animRef.current.nodVel += 1.6;
                animRef.current.waveVel += 3.6;
                showNextQuip();
              } else {
                autoGreetTimerRef.current = setTimeout(retry, 4000);
              }
            };
            autoGreetTimerRef.current = setTimeout(retry, 4000);
          }
        }, bubbleMs + 8500);
      }

      return bubbleMs;
    },
    [scheduleExpressionReset, triggerGlint]
  );

  // Automatic initial greeting shortly after load (resets automatically on any click)
  useEffect(() => {
    autoGreetTimerRef.current = setTimeout(() => {
      if (!inViewRef.current) return;
      animRef.current.nodVel += 2.1;
      animRef.current.waveVel += 4.5;
      showNextQuip();
    }, 1500);

    return () => {
      if (autoGreetTimerRef.current) clearTimeout(autoGreetTimerRef.current);
    };
  }, [showNextQuip]);

  const triggerSparkles = useCallback(() => {
    setSparkleBurst(false);
    requestAnimationFrame(() => {
      setSparkleBurst(true);
    });
    if (sparkleTimerRef.current) clearTimeout(sparkleTimerRef.current);
    sparkleTimerRef.current = setTimeout(() => setSparkleBurst(false), 850);
  }, []);

  // Track rapid 3-click combo easter egg
  const registerTapCombo = useCallback(() => {
    const now = performance.now();
    if (now - comboRef.current.lastTs < 950) {
      comboRef.current.count += 1;
    } else {
      comboRef.current.count = 1;
    }
    comboRef.current.lastTs = now;

    if (comboRef.current.count >= 3) {
      comboRef.current.count = 0;
      animRef.current.waveVel += 7.5;
      animRef.current.armVel += 5.2;
      animRef.current.nodVel += 3.5;
      animRef.current.winkPhase = 0.01;
      triggerGlint();
      triggerSparkles();
      showNextQuip("Haha, hey! I'm here!");
      return true;
    }
    return false;
  }, [showNextQuip, triggerGlint, triggerSparkles]);

  const handleToggleShades = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (dragRef.current.moved) return;
      setHasInteracted(true);
      if (registerTapCombo()) return;
      setShadesDown((prev) => {
        const next = !prev;
        if (next) {
          animRef.current.browTarget = 1;
          animRef.current.smileTarget = 1;
          animRef.current.nodVel += 1.5;
          animRef.current.winkPhase = 0;
          animRef.current.winkVal = 1;
          showNextQuip('Yooo!', 'cheeky');
        } else {
          animRef.current.browTarget = 0;
          animRef.current.smileTarget = 0;
          animRef.current.nodVel -= 1.2;
          triggerGlint();
        }
        return next;
      });
    },
    [registerTapCombo, showNextQuip, triggerGlint]
  );

  const handleEarClick = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (dragRef.current.moved || dragRef.current.charged) return;
      setHasInteracted(true);
      animRef.current.brokeTarget = 0;
      setBrokeFx(false);
      animRef.current.shakeVel += 12.5;
      animRef.current.browTarget = 0.9;
      animRef.current.smileTarget = 1;
      const ms = showNextQuip("Yes, I'm listening!");
      scheduleExpressionReset(ms);
    },
    [scheduleExpressionReset, showNextQuip]
  );

  const handleNoseBoop = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (dragRef.current.moved || dragRef.current.charged) return;
      setHasInteracted(true);
      animRef.current.brokeTarget = 0;
      setBrokeFx(false);
      animRef.current.nodVel -= 4.2;
      animRef.current.browTarget = 1;
      animRef.current.smileTarget = 1;
      triggerSparkles();
      const ms = showNextQuip('Boop! Watch the nose!');
      scheduleExpressionReset(ms);
    },
    [scheduleExpressionReset, showNextQuip, triggerSparkles]
  );

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setHasInteracted(true);
      animRef.current.brokeTarget = 0;
      setBrokeFx(false);
      animRef.current.waveVel += 6.8;
      animRef.current.armVel += 4.5;
      animRef.current.nodVel += 2.6;
      triggerGlint();
      triggerSparkles();
      const ms = showNextQuip();
      scheduleExpressionReset(ms);
    },
    [scheduleExpressionReset, showNextQuip, triggerGlint, triggerSparkles]
  );

  const handlePocketClick = useCallback(
    (side) => (e) => {
      e?.stopPropagation?.();
      if (dragRef.current.moved || dragRef.current.charged) return;
      setHasInteracted(true);
      if (side === 'left') {
        animRef.current.leftPocketVel += 11;
      } else {
        animRef.current.rightPocketVel += 11;
      }
      setBrokeFx(false);
      requestAnimationFrame(() => setBrokeFx(true));
      animRef.current.brokeTarget = 1;
      animRef.current.smileTarget = 0;
      animRef.current.nodVel += 2.6;
      const ms = showNextQuip('I am broke!', 'broke');
      if (brokeTimerRef.current) clearTimeout(brokeTimerRef.current);
      brokeTimerRef.current = setTimeout(() => {
        animRef.current.brokeTarget = 0;
        setBrokeFx(false);
      }, ms);
    },
    [showNextQuip]
  );

  const handleDoubleClick = useCallback(
    (e) => {
      e?.stopPropagation?.();
      setHasInteracted(true);
      animRef.current.brokeTarget = 0;
      setBrokeFx(false);
      animRef.current.armVel += 5.8;
      animRef.current.waveVel += 7.2;
      animRef.current.nodVel += 3.4;
      animRef.current.winkPhase = 0.01;
      animRef.current.smileTarget = 1;
      triggerGlint();
      triggerSparkles();
      const ms = showNextQuip('Nice to meet you!');
      scheduleExpressionReset(ms);
    },
    [scheduleExpressionReset, showNextQuip, triggerGlint, triggerSparkles]
  );

  const handleHairClick = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (dragRef.current.moved) return;
      setHasInteracted(true);
      if (registerTapCombo()) return;
      animRef.current.nodVel += 2.2;
      animRef.current.browTarget = 0.9;
      animRef.current.smileTarget = 1;
      scheduleExpressionReset(1000);
    },
    [registerTapCombo, scheduleExpressionReset]
  );

  const handleHandClick = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (dragRef.current.moved) return;
      setHasInteracted(true);
      if (registerTapCombo()) return;
      animRef.current.brokeTarget = 0;
      setBrokeFx(false);
      animRef.current.waveVel += 6.5;
      animRef.current.armVel += 3.6;
      animRef.current.nodVel += 2.4;
      animRef.current.smileTarget = 1;
      animRef.current.winkPhase = 0.01;
      const ms = showNextQuip();
      scheduleExpressionReset(ms);
    },
    [registerTapCombo, scheduleExpressionReset, showNextQuip]
  );

  const handleTorsoClick = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (dragRef.current.moved) return;
      setHasInteracted(true);
      if (registerTapCombo()) return;
      animRef.current.brokeTarget = 0;
      setBrokeFx(false);
      animRef.current.nodVel += 3.2;
      animRef.current.armVel += 4.4;
      animRef.current.waveVel += 4.2;
      animRef.current.smileTarget = 1;
      const ms = showNextQuip();
      scheduleExpressionReset(ms);
    },
    [registerTapCombo, scheduleExpressionReset, showNextQuip]
  );

  // Elastic drag-tilt + long-press power-up charge on mouse / touch
  const handlePointerDown = useCallback((e) => {
    markActive();
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragRef.current = {
      active: true,
      moved: false,
      charged: false,
      startX: e.clientX,
      startY: e.clientY,
    };
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      if (dragRef.current.active && !dragRef.current.moved) {
        dragRef.current.charged = true;
        setIsCharging(true);
        setHasInteracted(true);
        animRef.current.armVel += 5;
        animRef.current.browTarget = 1;
        triggerGlint();
      }
    }, 480);
  }, [triggerGlint]);

  useEffect(() => {
    const onWindowPointerMove = (e) => {
      if (!dragRef.current.active) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      if (!dragRef.current.moved && Math.hypot(dx, dy) > 8) {
        dragRef.current.moved = true;
        if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
        setIsCharging(false);
        setIsDragging(true);
        setHasInteracted(true);
        animRef.current.browTarget = 0.85;
      }
      if (dragRef.current.moved) {
        animRef.current.dragTargetX = clamp(dx * 0.24, -36, 36);
        animRef.current.dragTargetY = clamp(dy * 0.16, -18, 22);
      }
    };

    const onWindowPointerUp = () => {
      if (!dragRef.current.active) return;
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      const wasDragged = dragRef.current.moved;
      const wasCharged = dragRef.current.charged;
      dragRef.current.active = false;
      setIsDragging(false);
      setIsCharging(false);
      animRef.current.dragTargetX = 0;
      animRef.current.dragTargetY = 0;
      if (wasCharged) {
        animRef.current.armVel += 6.5;
        animRef.current.waveVel += 7.5;
        animRef.current.nodVel += 3.2;
        animRef.current.smileTarget = 1;
        triggerGlint();
        triggerSparkles();
        showNextQuip('Full stack power! Ready!');
        setTimeout(() => {
          dragRef.current.charged = false;
          if (animRef.current.shadesTarget === 0) {
            animRef.current.browTarget = 0;
            animRef.current.smileTarget = 0;
          }
        }, 120);
      } else if (wasDragged) {
        animRef.current.nodVel += 2.2;
        animRef.current.smileTarget = 1;
        showNextQuip('Haha, hey there!');
        setTimeout(() => {
          dragRef.current.moved = false;
          if (animRef.current.shadesTarget === 0) {
            animRef.current.browTarget = 0;
            animRef.current.smileTarget = 0;
          }
        }, 120);
      }
    };

    window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
    window.addEventListener('pointerup', onWindowPointerUp);
    window.addEventListener('pointercancel', onWindowPointerUp);
    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerUp);
    };
  }, [showNextQuip, triggerGlint, triggerSparkles]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggleShades();
        showNextQuip();
      }
    },
    [handleToggleShades, showNextQuip]
  );

  useEffect(() => {
    return () => {
      if (quipTimerRef.current) clearTimeout(quipTimerRef.current);
      if (reactionResetTimerRef.current) clearTimeout(reactionResetTimerRef.current);
      if (glintTimerRef.current) clearTimeout(glintTimerRef.current);
      if (sparkleTimerRef.current) clearTimeout(sparkleTimerRef.current);
      if (brokeTimerRef.current) clearTimeout(brokeTimerRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return undefined;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia?.('(pointer: fine)').matches;

    const stackSection = stageEl.closest('.stack-section');
    let stackActive = stackSection ? stackSection.dataset.stackActive !== 'false' : true;
    let inView = true;
    let rafId = 0;
    let lastTs = performance.now();

    const applyTransforms = (s) => {
      // Organic human breathing curve (smooth inhale, soft exhale pause)
      const rawBreath = (Math.sin(s.time * 1.65) + 1) * 0.5;
      const breath = reducedMotion ? 0 : (Math.pow(rawBreath, 1.45) * 2 - 1) * (1 + s.hoverVal * 0.25);
      const breathLag = reducedMotion ? 0 : (Math.pow((Math.sin(s.time * 1.65 - 0.35) + 1) * 0.5, 1.45) * 2 - 1);
      const microSway = reducedMotion ? 0 : Math.sin(s.time * 0.85) * 0.65 + Math.sin(s.time * 1.42) * 0.25;

      // Effective sunglasses drop: full drop when clicked, suave micro-peek (~0.48) on face hover
      const effectiveShades = Math.max(s.shadesVal, s.faceHoverVal * 0.48);

      // 1. Torso: organic breathing + elastic drag-tilt + broke slump + deep yawn inhale
      if (torsoRef.current) {
        const tx = s.mx * (5 + s.hoverVal * 2.5) + s.dragX * 0.55;
        const ty = s.my * 3 - breath * 2.5 - s.hoverVal * 3.5 + s.dragY * 0.45 + s.brokeVal * 7.5 - s.yawnVal * 4.5;
        const rot = s.mx * (1.5 + s.hoverVal * 0.8) + s.dragX * 0.28 + microSway * 0.4 - s.brokeVal * 1.4;
        const chestScaleX = 1 + breath * 0.0055 - s.brokeVal * 0.012 + s.yawnVal * 0.014;
        const chestScaleY = 1 + breath * 0.0035 - s.brokeVal * 0.01 + s.yawnVal * 0.01;
        torsoRef.current.setAttribute(
          'transform',
          `translate(${tx.toFixed(2)}, ${ty.toFixed(2)}) translate(280 560) rotate(${rot.toFixed(2)}) scale(${chestScaleX.toFixed(4)}, ${chestScaleY.toFixed(4)}) translate(-280 -560)`
        );
      }

      // 1b. Jacket lapels secondary follow-through + interactive chest pocket flap pops
      if (leftCollarRef.current) {
        const lcRot = -(breathLag * 1.2 + s.armVal * 1.8);
        leftCollarRef.current.setAttribute('transform', `rotate(${lcRot.toFixed(2)} 216 330)`);
      }
      if (rightCollarRef.current) {
        const rcRot = breathLag * 1.2 + s.armVal * 1.8;
        rightCollarRef.current.setAttribute('transform', `rotate(${rcRot.toFixed(2)} 344 330)`);
      }
      if (leftPocketFlapRef.current) {
        const lpScaleY = clamp(1 - s.leftPocketVal * 0.55, 0.35, 1.15);
        leftPocketFlapRef.current.setAttribute(
          'transform',
          `translate(173 454) scale(1, ${lpScaleY.toFixed(3)}) translate(-173 -454)`
        );
      }
      if (rightPocketFlapRef.current) {
        const rpScaleY = clamp(1 - s.rightPocketVal * 0.55, 0.35, 1.15);
        rightPocketFlapRef.current.setAttribute(
          'transform',
          `translate(387 454) scale(1, ${rpScaleY.toFixed(3)}) translate(-387 -454)`
        );
      }

      // 2. Crossed arms: breathing lift + click flex + hand hover poise
      if (armsRef.current) {
        const ax = s.mx * 3.8;
        const ay = s.my * 2 - breathLag * 2.1 - s.armVal * 5.8 - s.handHoverVal * 3.2;
        const aScale = 1 + s.armVal * 0.017 + s.handHoverVal * 0.008;
        armsRef.current.setAttribute(
          'transform',
          `translate(${ax.toFixed(2)}, ${ay.toFixed(2)}) translate(280 540) scale(${aScale.toFixed(4)}) translate(-280 -540)`
        );
      }

      // 2b. Right forearm counterbalance motion
      if (rightForearmRef.current) {
        const rfY = -breathLag * 1.2 + s.handHoverVal * 1.6 - s.armVal * 1.8;
        const rfRot = -s.handHoverVal * 1.6 + breathLag * 0.6;
        rightForearmRef.current.setAttribute(
          'transform',
          `translate(0, ${rfY.toFixed(2)}) rotate(${rfRot.toFixed(2)} 190 554)`
        );
      }

      // 2c. Articulated Left Hand — S-curve multi-joint wave (wrist leads, fingers trail with phase lag)
      const handActive = clamp(s.handHoverVal + Math.max(0, s.waveVal * 0.85), 0, 1.35);
      const idleTapAmp = reducedMotion ? 0 : 0.25 + s.hoverVal * 0.75;
      const waveWrist = reducedMotion ? 0 : Math.sin(s.time * 8.2) * handActive;
      const waveF1 = reducedMotion ? 0 : Math.sin(s.time * 8.2 - 0.42) * handActive;
      const waveF2 = reducedMotion ? 0 : Math.sin(s.time * 8.2 - 0.82) * handActive;
      const waveF3 = reducedMotion ? 0 : Math.sin(s.time * 8.2 - 1.2) * handActive;

      if (leftHandRef.current) {
        const lhX = handActive * 5.5 + s.mx * 1.8;
        const lhY = -handActive * 11.8 - Math.abs(waveWrist) * 2.4 - breathLag * 0.9;
        const lhRot = -handActive * 15.5 + waveWrist * 7.2;
        leftHandRef.current.setAttribute(
          'transform',
          `translate(${lhX.toFixed(2)}, ${lhY.toFixed(2)}) rotate(${lhRot.toFixed(2)} 388 534)`
        );
      }

      if (finger1Ref.current) {
        const tap1 = Math.max(0, Math.sin(s.time * 4.8)) * idleTapAmp;
        const rot1 = -tap1 * 7.5 - handActive * 10.5 + waveF1 * 4.2;
        const y1 = -tap1 * 3.2 - handActive * 2.5;
        finger1Ref.current.setAttribute(
          'transform',
          `translate(0, ${y1.toFixed(2)}) rotate(${rot1.toFixed(2)} 414 484)`
        );
      }

      if (finger2Ref.current) {
        const tap2 = Math.max(0, Math.sin(s.time * 4.8 - 0.95)) * idleTapAmp;
        const rot2 = -tap2 * 6.8 - handActive * 3.8 + waveF2 * 3.4;
        const y2 = -tap2 * 2.8 - handActive * 1.3;
        finger2Ref.current.setAttribute(
          'transform',
          `translate(0, ${y2.toFixed(2)}) rotate(${rot2.toFixed(2)} 418 504)`
        );
      }

      if (finger3Ref.current) {
        const tap3 = Math.max(0, Math.sin(s.time * 4.8 - 1.9)) * idleTapAmp;
        const rot3 = -tap3 * 5.5 + handActive * 7.5 + waveF3 * 2.4;
        const y3 = -tap3 * 2.2 + handActive * 1.4;
        finger3Ref.current.setAttribute(
          'transform',
          `translate(0, ${y3.toFixed(2)}) rotate(${rot3.toFixed(2)} 416 524)`
        );
      }

      // 3. Neck (child of torso — welded at collar pivot 280, 358)
      if (neckRef.current) {
        const neckRot = clamp(s.mx * 2.0 + s.dragX * 0.12 + s.shakeVal * 1.2, -10, 10);
        neckRef.current.setAttribute('transform', `rotate(${neckRot.toFixed(2)} 280 358)`);
      }

      // 4. Head group (child of neck — ball-and-socket pivot at rounded neck cap 280, 246!)
      if (headRef.current) {
        const talkBob = s.talkOpen * 0.9;
        const winkTilt = (1 - s.winkVal) * -2.2;
        const hx = clamp(s.mx * 1.8 + s.shakeVal * 2.2, -5, 5);
        const hy = clamp(
          s.my * 1.8 + s.nodVal * 3.6 + talkBob - s.hoverVal * 1.4 + s.brokeVal * 5.2 - s.yawnVal * 3.2 + s.tiredVal * 2.0,
          -7,
          8
        );
        const hRot = clamp(
          s.mx * (4.0 + s.hoverVal * 1.6) +
            s.dragX * 0.14 +
            s.shakeVal * 4.2 +
            s.nodVal * 2.8 +
            s.faceHoverVal * -2.0 +
            winkTilt -
            s.brokeVal * 5.2 -
            s.yawnVal * 4.5 +
            s.tiredVal * 3.4 -
            s.smugVal * 2.4 +
            s.cheekyVal * 2.2 +
            microSway * 0.65,
          -14,
          14
        );
        headRef.current.setAttribute(
          'transform',
          `translate(${hx.toFixed(2)}, ${hy.toFixed(2)}) rotate(${hRot.toFixed(2)} 280 246)`
        );
      }

      // 5. Ears subtle 2.5D depth (hair stays locked 1:1 with head)
      if (earsRef.current) {
        const ex = -s.mx * 4;
        const ey = -s.my * 1.8;
        earsRef.current.setAttribute('transform', `translate(${ex.toFixed(2)}, ${ey.toFixed(2)})`);
      }

      // 6. Facial features forward 2.5D parallax
      if (faceFeaturesRef.current) {
        const fx = s.mx * (8.5 + s.hoverVal * 2);
        const fy = s.my * (5.5 + s.hoverVal * 1.2);
        faceFeaturesRef.current.setAttribute('transform', `translate(${fx.toFixed(2)}, ${fy.toFixed(2)})`);
      }

      // 7. Eyes & pupils track pointer + natural micro-saccades + hover focus dilation
      const px = clamp(s.mx * 6.8 + s.saccadeX, -6, 6);
      const py = clamp(s.my * 4.6 + s.saccadeY, -3.8, 3.8);
      const pupilScale = 1 + s.faceHoverVal * 0.08;
      if (leftPupilRef.current) {
        leftPupilRef.current.setAttribute(
          'transform',
          `translate(${px.toFixed(2)}, ${py.toFixed(2)}) translate(244 173) scale(${pupilScale.toFixed(3)}) translate(-244 -173)`
        );
      }
      if (rightPupilRef.current) {
        rightPupilRef.current.setAttribute(
          'transform',
          `translate(${px.toFixed(2)}, ${py.toFixed(2)}) translate(316 173) scale(${pupilScale.toFixed(3)}) translate(-316 -173)`
        );
      }

      // Eyelids: natural blink + sleepy/tired half-lid + yawn squint + wink
      if (leftEyelidRef.current && rightEyelidRef.current) {
        const baseSleepy = Math.max(s.tiredVal * 0.44, s.yawnVal * 0.82);
        const leftClosed = clamp(Math.max(1 - s.blinkVal, baseSleepy), 0, 1);
        const rightClosed = clamp(Math.max(1 - s.blinkVal, 1 - s.winkVal, baseSleepy), 0, 1);
        leftEyelidRef.current.setAttribute(
          'transform',
          `translate(244 173) scale(1, ${leftClosed.toFixed(3)}) translate(-244 -173)`
        );
        rightEyelidRef.current.setAttribute(
          'transform',
          `translate(316 173) scale(1, ${rightClosed.toFixed(3)}) translate(-316 -173)`
        );
      }

      // 8. Independent Eyebrow Choreography (mood-driven: smug cock, tired droop, cheeky lift, broke / \, yawn)
      const lookBrow = clamp(-s.my * 2.6, -2, 3);
      const blinkDip = (1 - s.blinkVal) * 1.6;
      const talkBrow = s.talkOpen * 2.2;
      if (leftBrowRef.current) {
        const lbY =
          -(
            s.browVal * 5.2 +
            s.hoverVal * 1.6 +
            s.faceHoverVal * 2.2 +
            effectiveShades * 1.8 +
            lookBrow +
            talkBrow +
            s.cheekyVal * 3.2 +
            s.yawnVal * 4.0
          ) +
          blinkDip -
          s.brokeVal * 2.5 +
          s.tiredVal * 3.0;
        const lbRot =
          s.faceHoverVal * -3.8 -
          s.hoverVal * 1.5 -
          s.brokeVal * 14 -
          s.smugVal * 5.5 -
          s.tiredVal * 5.0 -
          s.yawnVal * 4.0;
        leftBrowRef.current.setAttribute(
          'transform',
          `translate(0, ${lbY.toFixed(2)}) rotate(${lbRot.toFixed(2)} 240 152)`
        );
      }
      if (rightBrowRef.current) {
        const winkDip = (1 - s.winkVal) * 2.4;
        const rbY =
          -(
            s.browVal * 6.8 +
            s.hoverVal * 2.4 +
            s.faceHoverVal * 6.2 +
            effectiveShades * 2.2 +
            lookBrow +
            talkBrow +
            s.smugVal * 4.2 +
            s.cheekyVal * 3.6 +
            s.yawnVal * 4.0
          ) +
          blinkDip +
          winkDip -
          s.brokeVal * 2.5 +
          s.tiredVal * 3.0;
        const rbRot =
          s.faceHoverVal * 6.4 +
          s.hoverVal * 2.2 +
          (1 - s.winkVal) * -5.5 +
          s.brokeVal * 14 +
          s.smugVal * 7.5 +
          s.tiredVal * 5.0 +
          s.yawnVal * 4.0;
        rightBrowRef.current.setAttribute(
          'transform',
          `translate(0, ${rbY.toFixed(2)}) rotate(${rbRot.toFixed(2)} 320 152)`
        );
      }

      // 9. Expressive Smirk + Sad Broke Frown + Slow Speaking Mouth + Big Yawn Mouth
      if (mustacheRef.current) {
        const mY = -s.talkOpen * 0.6 + s.brokeVal * 0.8 - s.yawnVal * 2.2;
        mustacheRef.current.setAttribute('transform', `translate(0, ${mY.toFixed(2)})`);
      }
      if (chinBeardRef.current) {
        const cbY = s.talkOpen * 1.8 + s.yawnVal * 5.2;
        chinBeardRef.current.setAttribute('transform', `translate(0, ${cbY.toFixed(2)})`);
      }
      if (mouthRef.current) {
        const smileAmt = clamp(
          (s.smileVal + s.hoverVal * 0.45 + s.faceHoverVal * 0.55 + s.cheekyVal * 0.35) *
            (1 - s.brokeVal) *
            (1 - s.yawnVal),
          0,
          1.35
        );
        const smileScaleX = 1 + smileAmt * 0.085;
        const smileScaleY = 1 + smileAmt * 0.06;
        const smileY = -smileAmt * 1.6 + s.brokeVal * 1.2;
        const smileRot = -(smileAmt * 2.8 + s.smugVal * 2.6) * (1 - s.talkOpen * 0.7) * (1 - s.yawnVal);
        mouthRef.current.setAttribute(
          'transform',
          `translate(280 ${(236 + smileY).toFixed(2)}) rotate(${smileRot.toFixed(2)}) scale(${smileScaleX.toFixed(3)}, ${smileScaleY.toFixed(3)}) translate(-280 -236)`
        );
      }
      if (smirkRef.current) {
        const smirkOpacity = clamp((1 - s.talkOpen * 1.5) * (1 - s.brokeVal * 1.3) * (1 - s.yawnVal * 1.8), 0, 1);
        smirkRef.current.setAttribute('opacity', smirkOpacity.toFixed(3));
      }
      if (sadMouthRef.current) {
        const sadOpacity = clamp(s.brokeVal * (1 - s.talkOpen * 1.5) * (1 - s.yawnVal * 1.8), 0, 1);
        sadMouthRef.current.setAttribute('opacity', sadOpacity.toFixed(3));
      }
      if (talkMouthRef.current) {
        const openScaleY = clamp(s.talkOpen * 0.85 * (1 - s.yawnVal), 0, 0.85);
        const openScaleX = 0.88 + openScaleY * 0.12;
        talkMouthRef.current.setAttribute('opacity', openScaleY > 0.05 ? '1' : '0');
        talkMouthRef.current.setAttribute(
          'transform',
          `translate(280 236) scale(${openScaleX.toFixed(3)}, ${openScaleY.toFixed(3)}) translate(-280 -236)`
        );
      }
      if (yawnMouthRef.current) {
        const yScaleY = clamp(s.yawnVal, 0, 1);
        const yScaleX = 0.72 + yScaleY * 0.34;
        yawnMouthRef.current.setAttribute('opacity', yScaleY > 0.06 ? '1' : '0');
        yawnMouthRef.current.setAttribute(
          'transform',
          `translate(280 237) scale(${yScaleX.toFixed(3)}, ${yScaleY.toFixed(3)}) translate(-280 -237)`
        );
      }

      if (cheekGlowRef.current) {
        const winkSquint = (1 - s.winkVal) * 0.25;
        cheekGlowRef.current.setAttribute(
          'opacity',
          clamp(0.5 + s.faceHoverVal * 0.35 + s.hoverVal * 0.1 + winkSquint, 0, 0.95).toFixed(2)
        );
      }

      // 10. Sunglasses: full drop on click, suave micro-peek on face hover
      if (sunglassesRef.current) {
        const sgX = s.mx * 2.4;
        const sgY = s.my * 1.5 + effectiveShades * 28;
        const sgRot = effectiveShades * -2.6 + s.mx * 1.2 + s.faceHoverVal * 0.8;
        sunglassesRef.current.setAttribute(
          'transform',
          `translate(${sgX.toFixed(2)}, ${sgY.toFixed(2)}) rotate(${sgRot.toFixed(2)} 280 178)`
        );
      }

      // Dynamic lens reflection sweep (amplified on hover)
      const shineX = s.mx * (20 + s.hoverVal * 8) + s.faceHoverVal * 6;
      if (lensShineLeftRef.current) {
        lensShineLeftRef.current.setAttribute('transform', `translate(${shineX.toFixed(2)}, 0)`);
      }
      if (lensShineRightRef.current) {
        lensShineRightRef.current.setAttribute('transform', `translate(${shineX.toFixed(2)}, 0)`);
      }
    };

    const step = (ts) => {
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      const s = animRef.current;

      s.time += dt;

      // Smooth pointer & hover zone easing
      const ease = 1 - Math.exp(-9 * dt);
      s.prevMx = s.mx;
      s.prevMy = s.my;
      s.mx += (s.targetMx - s.mx) * ease;
      s.my += (s.targetMy - s.my) * ease;

      // Second-order spring inertia for hair follow-through driven by head movement velocity
      const headVelX = (s.mx - s.prevMx) / Math.max(dt, 0.008);
      const headVelY = (s.my - s.prevMy) / Math.max(dt, 0.008);
      const hairLagFx = (-headVelX * 0.22 - s.hairLagX) * 115 - s.hairLagVx * 11;
      const hairLagFy = (-headVelY * 0.22 - s.hairLagY) * 115 - s.hairLagVy * 11;
      s.hairLagVx += hairLagFx * dt;
      s.hairLagVy += hairLagFy * dt;
      s.hairLagX = clamp(s.hairLagX + s.hairLagVx * dt, -0.7, 0.7);
      s.hairLagY = clamp(s.hairLagY + s.hairLagVy * dt, -0.7, 0.7);

      // Subtle living eye micro-saccades
      if (!reducedMotion) {
        s.saccadeTimer -= dt;
        if (s.saccadeTimer <= 0) {
          s.saccadeTimer = 1.3 + Math.random() * 1.9;
          s.saccadeTargetX = (Math.random() - 0.5) * 2.2;
          s.saccadeTargetY = (Math.random() - 0.5) * 1.4;
        }
        const sacEase = 1 - Math.exp(-16 * dt);
        s.saccadeX += (s.saccadeTargetX - s.saccadeX) * sacEase;
        s.saccadeY += (s.saccadeTargetY - s.saccadeY) * sacEase;
      }
      s.hoverVal += (s.hoverTarget - s.hoverVal) * (1 - Math.exp(-8 * dt));
      s.faceHoverVal += (s.faceHoverTarget - s.faceHoverVal) * (1 - Math.exp(-9.5 * dt));
      s.handHoverVal += (s.handHoverTarget - s.handHoverVal) * (1 - Math.exp(-10 * dt));
      s.hairHoverVal += (s.hairHoverTarget - s.hairHoverVal) * (1 - Math.exp(-9 * dt));
      s.browVal += (s.browTarget - s.browVal) * (1 - Math.exp(-10 * dt));
      s.smileVal += (s.smileTarget - s.smileVal) * (1 - Math.exp(-9.5 * dt));
      s.brokeVal += (s.brokeTarget - s.brokeVal) * (1 - Math.exp(-7.5 * dt));
      s.smugVal += (s.smugTarget - s.smugVal) * (1 - Math.exp(-8 * dt));
      s.tiredVal += (s.tiredTarget - s.tiredVal) * (1 - Math.exp(-7 * dt));
      s.cheekyVal += (s.cheekyTarget - s.cheekyVal) * (1 - Math.exp(-9 * dt));

      // Enter continuous idle yawning after 5 seconds of inactivity until mouse moves!
      if (
        !reducedMotion &&
        stackActive &&
        inView &&
        !document.hidden &&
        !s.idleYawning &&
        s.talkRemaining === 0 &&
        s.brokeTarget === 0 &&
        s.time - s.lastActiveTime >= 5.0
      ) {
        s.idleYawning = true;
        s.yawnPhase = 0.01;
        showNextQuip('*yawn*...', 'yawn');
      }

      if (!reducedMotion && s.idleYawning) {
        // Continuous relaxed yawn wave (opens wide, gently eases, yawns again until mouse moves)
        s.yawnPhase += dt * 1.45;
        const cycle = Math.sin(s.yawnPhase);
        const targetYawn = cycle > 0 ? 0.35 + Math.pow(cycle, 0.85) * 0.65 : 0.25 + (cycle + 1) * 0.1;
        s.yawnVal += (targetYawn - s.yawnVal) * (1 - Math.exp(-8 * dt));
      } else {
        s.yawnVal += (0 - s.yawnVal) * (1 - Math.exp(-12 * dt));
        if (s.yawnVal < 0.01) s.yawnVal = 0;
      }

      // Spring physics for sunglasses slide
      const shadesForce = (s.shadesTarget - s.shadesVal) * 190 - s.shadesVel * 17;
      s.shadesVel += shadesForce * dt;
      s.shadesVal += s.shadesVel * dt;

      // Spring physics for head nod
      const nodForce = (0 - s.nodVal) * 145 - s.nodVel * 12;
      s.nodVel += nodForce * dt;
      s.nodVal += s.nodVel * dt;

      // Spring physics for hair rustle
      const hairForce = (0 - s.hairVal) * 210 - s.hairVel * 11;
      s.hairVel += hairForce * dt;
      s.hairVal += s.hairVel * dt;

      // Spring physics for crossed arms flex
      const armForce = (0 - s.armVal) * 180 - s.armVel * 13;
      s.armVel += armForce * dt;
      s.armVal += s.armVel * dt;

      // Spring physics for hand wave impulse
      const waveForce = (0 - s.waveVal) * 135 - s.waveVel * 9.5;
      s.waveVel += waveForce * dt;
      s.waveVal += s.waveVel * dt;

      // Elastic drag spring snap-back
      const dragFx = (s.dragTargetX - s.dragX) * 185 - s.dragVx * 12;
      const dragFy = (s.dragTargetY - s.dragY) * 185 - s.dragVy * 12;
      s.dragVx += dragFx * dt;
      s.dragVy += dragFy * dt;
      s.dragX += s.dragVx * dt;
      s.dragY += s.dragVy * dt;

      // Ear-click playful head shake spring
      const shakeForce = (0 - s.shakeVal) * 260 - s.shakeVel * 9.5;
      s.shakeVel += shakeForce * dt;
      s.shakeVal += s.shakeVel * dt;

      // Chest pocket flap pop springs
      const lpForce = (0 - s.leftPocketVal) * 190 - s.leftPocketVel * 11;
      s.leftPocketVel += lpForce * dt;
      s.leftPocketVal += s.leftPocketVel * dt;
      const rpForce = (0 - s.rightPocketVal) * 190 - s.rightPocketVel * 11;
      s.rightPocketVel += rpForce * dt;
      s.rightPocketVal += s.rightPocketVel * dt;

      // Playful right-eye wink animation
      if (!reducedMotion && s.winkPhase > 0) {
        s.winkPhase += dt * 9.5;
        if (s.winkPhase >= Math.PI) {
          s.winkPhase = 0;
          s.winkVal = 1;
        } else {
          s.winkVal = Math.max(0.04, 1 - Math.sin(s.winkPhase));
        }
      } else {
        s.winkVal = 1;
      }

      // Slow, simple, smooth speaking mouth cadence while greeting bubble is active
      if (!reducedMotion && s.talkRemaining > 0) {
        s.talkRemaining = Math.max(0, s.talkRemaining - dt);
        const envelope = clamp(s.talkRemaining / 0.35, 0, 1);
        const syllable = Math.pow((1 - Math.cos(s.time * 7.2)) * 0.5, 1.15);
        const targetTalk = (0.14 + syllable * 0.72) * envelope;
        s.talkOpen += (targetTalk - s.talkOpen) * (1 - Math.exp(-9.5 * dt));
      } else {
        s.talkOpen += (0 - s.talkOpen) * (1 - Math.exp(-10 * dt));
        if (s.talkOpen < 0.01) s.talkOpen = 0;
      }

      // Natural blinking whenever eyes are visible (shades down OR face hovered)
      const eyesVisible = s.shadesVal > 0.3 || s.faceHoverVal > 0.3;
      if (!reducedMotion && eyesVisible) {
        if (s.blinkPhase === 0) {
          s.blinkTimer -= dt;
          if (s.blinkTimer <= 0) {
            s.blinkPhase = 1;
          }
        } else {
          s.blinkPhase += dt * 11;
          if (s.blinkPhase >= Math.PI) {
            s.blinkPhase = 0;
            s.blinkVal = 1;
            s.blinkTimer = 2.6 + Math.random() * 2.8;
          } else {
            s.blinkVal = Math.max(0.04, 1 - Math.sin(s.blinkPhase));
          }
        }
      } else {
        s.blinkVal = 1;
        s.blinkPhase = 0;
      }

      applyTransforms(s);

      if (stackActive && inView && !reducedMotion) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = 0;
      }
    };

    const startLoop = () => {
      if (!rafId && stackActive && inView && !reducedMotion) {
        lastTs = performance.now();
        rafId = requestAnimationFrame(step);
      }
    };

    const stopLoop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const onPointerMove = (e) => {
      if (!stackActive || !inView) return;
      markActive();
      const rect = stageEl.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.28;
      const dx = (e.clientX - cx) / (window.innerWidth * 0.5);
      const dy = (e.clientY - cy) / (window.innerHeight * 0.5);
      animRef.current.targetMx = clamp(dx, -1, 1);
      animRef.current.targetMy = clamp(dy, -1, 1);

      // Detect playful fast mouse wiggle across the hero
      const w = wiggleRef.current;
      const moveDelta = e.clientX - w.lastX;
      if (Math.abs(moveDelta) > 26) {
        const dir = moveDelta > 0 ? 1 : -1;
        const now = performance.now();
        if (w.lastDir !== 0 && dir !== w.lastDir && now - w.lastFlipTs < 340) {
          w.flips += 1;
          w.lastFlipTs = now;
          if (w.flips >= 4 && now > w.cooldownUntil) {
            w.flips = 0;
            w.cooldownUntil = now + 5000;
            animRef.current.shakeVel += 9;
            animRef.current.browTarget = 0.9;
            showNextQuip('Whoa, making me dizzy!');
            setTimeout(() => {
              if (animRef.current.shadesTarget === 0) {
                animRef.current.browTarget = 0;
              }
            }, 1200);
          }
        } else if (now - w.lastFlipTs >= 340) {
          w.flips = 1;
          w.lastFlipTs = now;
        }
        w.lastDir = dir;
        w.lastX = e.clientX;
      }
    };

    const onPointerLeave = () => {
      animRef.current.targetMx = 0;
      animRef.current.targetMy = 0;
    };

    const onStackActiveChange = (e) => {
      stackActive = Boolean(e.detail?.active);
      if (stackActive) startLoop();
      else stopLoop();
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        inViewRef.current = inView;
        if (inView) startLoop();
        else stopLoop();
      },
      { threshold: 0.01 }
    );
    io.observe(stageEl);

    stackSection?.addEventListener('stackactivechange', onStackActiveChange);
    if (finePointer && !reducedMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onPointerLeave);
    }

    if (reducedMotion) {
      applyTransforms(animRef.current);
    } else {
      startLoop();
    }

    return () => {
      stopLoop();
      io.disconnect();
      stackSection?.removeEventListener('stackactivechange', onStackActiveChange);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  // Re-apply static transform in reduced-motion mode when shades toggle
  useEffect(() => {
    if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (sunglassesRef.current) {
      sunglassesRef.current.setAttribute(
        'transform',
        shadesDown ? 'translate(0, 28) rotate(-2.2 280 178)' : 'translate(0, 0)'
      );
    }
  }, [shadesDown]);

  return (
    <div
      ref={stageRef}
      className="hero-avatar-stage"
      aria-label="Interactive 2D avatar of Bikash Dhakal"
    >
      {/* Comic-style speech bubble on interaction click */}
      <div
        className={`avatar-quip ${quipVisible ? 'avatar-quip--visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        <span className="avatar-quip-text">{quip}</span>
        <svg
          className="avatar-quip-tail"
          viewBox="0 0 22 18"
          fill="none"
          aria-hidden="true"
        >
          {/* Tail fill */}
          <path d="M4 0 L20 2 L2 16 Z" fill="#ffffff" />
          {/* Crisp comic ink outline on outer edges only */}
          <path
            d="M4 0 L2 16 L19 3"
            stroke="#18181b"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Whisper-subtle hover cue before first interaction */}
      <div
        className={`avatar-hint ${hovered && !hasInteracted ? 'avatar-hint--visible' : ''}`}
        aria-hidden="true"
      >
        Hover, click, or drag me
      </div>

      <svg
        className={`hero-avatar-svg ${isDragging ? 'hero-avatar-svg--dragging' : ''} ${isCharging ? 'hero-avatar-svg--charging' : ''}`}
        viewBox="0 0 560 760"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onPointerDown={handlePointerDown}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
        role="img"
        aria-label="Interactive 2D illustrated portrait of Bikash Dhakal wearing sunglasses and a light denim jacket. Hover face for sunglasses peek, hover hand for finger wave, drag to tilt, hold to power up, or click face, nose, ears, pockets, and jacket to interact."
      >
        <defs>
          {/* Skin gradients */}
          <linearGradient id="avSkinBase" x1="280" y1="90" x2="280" y2="290" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#dfa984" />
            <stop offset="65%" stopColor="#d49b76" />
            <stop offset="100%" stopColor="#be835f" />
          </linearGradient>

          <linearGradient id="avNeckGrad" x1="280" y1="255" x2="280" y2="375" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a9704e" />
            <stop offset="32%" stopColor="#c78e69" />
            <stop offset="100%" stopColor="#d69e79" />
          </linearGradient>

          <linearGradient id="avHandGrad" x1="380" y1="470" x2="465" y2="540" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#dfa984" />
            <stop offset="100%" stopColor="#c28762" />
          </linearGradient>

          {/* Hair & beard gradients */}
          <linearGradient id="avHairGrad" x1="280" y1="35" x2="280" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2f2b28" />
            <stop offset="55%" stopColor="#1f1c1a" />
            <stop offset="100%" stopColor="#141210" />
          </linearGradient>

          <linearGradient id="avBeardGrad" x1="280" y1="210" x2="280" y2="282" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2d2520" />
            <stop offset="100%" stopColor="#1a1512" />
          </linearGradient>

          {/* Sunglasses lens gradient */}
          <linearGradient id="avLensGrad" x1="210" y1="154" x2="355" y2="212" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#353b45" />
            <stop offset="45%" stopColor="#171a1f" />
            <stop offset="100%" stopColor="#0c0e12" />
          </linearGradient>

          {/* Denim jacket gradients */}
          <linearGradient id="avJacketMain" x1="280" y1="315" x2="280" y2="760" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#dfe2dd" />
            <stop offset="45%" stopColor="#cfd3ce" />
            <stop offset="100%" stopColor="#b5bab4" />
          </linearGradient>

          <linearGradient id="avJacketSleeve" x1="80" y1="380" x2="220" y2="620" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#dadcd8" />
            <stop offset="60%" stopColor="#c6cac5" />
            <stop offset="100%" stopColor="#aeb3ad" />
          </linearGradient>

          <linearGradient id="avJacketShadow" x1="280" y1="340" x2="280" y2="760" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#b6bbb5" />
            <stop offset="100%" stopColor="#949a93" />
          </linearGradient>

          {/* Black crew-neck tee */}
          <linearGradient id="avTeeGrad" x1="280" y1="335" x2="280" y2="760" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#26282d" />
            <stop offset="50%" stopColor="#191a1e" />
            <stop offset="100%" stopColor="#101114" />
          </linearGradient>

          {/* Star glint glow */}
          <filter id="avGlintGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip paths for moving lens reflections */}
          <clipPath id="avLeftLensClip">
            <path d="M206 164 C216 156, 255 156, 267 166 C271 178, 266 203, 245 206 C220 209, 204 192, 206 164 Z" />
          </clipPath>
          <clipPath id="avRightLensClip">
            <path d="M293 166 C305 156, 344 156, 354 164 C356 192, 340 209, 315 206 C294 203, 289 178, 293 166 Z" />
          </clipPath>

          {/* Clip paths for irises inside sclera */}
          <clipPath id="avLeftEyeClip">
            <path d="M222 173 Q244 160 264 173 Q244 184 222 173 Z" />
          </clipPath>
          <clipPath id="avRightEyeClip">
            <path d="M296 173 Q316 160 338 173 Q316 184 296 173 Z" />
          </clipPath>
        </defs>

        {/* Subtle keyboard focus ring around head */}
        <circle
          className="avatar-focus-ring"
          cx="280"
          cy="178"
          r="116"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        {/* ==================== TORSO & JACKET GROUP ==================== */}
        <g
          ref={torsoRef}
          className="avatar-hit-zone"
          tabIndex={0}
          role="button"
          aria-label="Interact with Bikash's avatar"
          onMouseDown={(e) => e.preventDefault()}
          onMouseEnter={() => setHoverZone('torso')}
          onMouseLeave={() => setHoverZone('none')}
          onClick={handleTorsoClick}
          onKeyDown={handleKeyDown}
        >
          {/* Back inside collar */}
          <path
            d="M214 316 Q280 296 346 316 L354 358 Q280 375 206 358 Z"
            fill="#9ea49d"
            stroke="#18181b"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />

          {/* Upper-chest & trapezius skin seamlessly filling the crew-neck opening */}
          <path
            d="M214 334 C232 316, 328 316, 346 334 L352 366 C322 388, 238 388, 208 366 Z"
            fill="#d49b76"
          />

          {/* Black crew-neck t-shirt */}
          <path
            d="M208 345 C235 376, 325 376, 352 345 L368 760 L192 760 Z"
            fill="url(#avTeeGrad)"
            stroke="#18181b"
            strokeWidth="2.2"
          />
          {/* T-shirt neckline rib */}
          <path
            d="M212 342 C238 378, 322 378, 348 342"
            stroke="#32353c"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M212 342 C238 378, 322 378, 348 342"
            stroke="#111215"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Subtle tee folds */}
          <path
            d="M242 415 Q250 470 244 525 M316 420 Q308 475 314 520"
            stroke="#101114"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.65"
          />

          {/* Left side of denim jacket (viewer's left) */}
          <path
            d="M216 320 C175 335, 118 352, 86 385 C58 415, 42 475, 40 546 C38 594, 58 626, 102 632 L116 628 L94 760 L236 760 L248 560 L226 392 Z"
            fill="url(#avJacketMain)"
            stroke="#18181b"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />

          {/* Right side of denim jacket (viewer's right) */}
          <path
            d="M344 320 C385 335, 442 352, 474 385 C502 415, 518 475, 520 546 C522 594, 502 626, 458 632 L444 628 L466 760 L324 760 L312 560 L334 392 Z"
            fill="url(#avJacketMain)"
            stroke="#18181b"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />

          {/* Cel-shaded shoulder & side shadows */}
          <path
            d="M86 385 C60 416, 46 476, 42 542 C41 572, 50 598, 70 612 C78 552, 92 480, 116 422 Z"
            fill="url(#avJacketShadow)"
            opacity="0.52"
          />
          <path
            d="M474 385 C500 416, 514 476, 518 542 C519 572, 510 598, 490 612 C482 552, 468 480, 444 422 Z"
            fill="url(#avJacketShadow)"
            opacity="0.52"
          />

          {/* Jacket top shoulder highlights */}
          <path
            d="M112 368 C142 354, 176 344, 206 336"
            stroke="#eef0ec"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M448 368 C418 354, 384 344, 354 336"
            stroke="#eef0ec"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Jacket front placket & seam lines */}
          <path
            d="M214 390 L224 760 M346 390 L336 760"
            stroke="#18181b"
            strokeWidth="2.2"
          />
          <path
            d="M202 405 L208 760 M358 405 L352 760"
            stroke="#8a9088"
            strokeWidth="1.4"
            strokeDasharray="5 4"
            opacity="0.75"
          />

          {/* Left chest flap pocket (clickable pocket pop!) */}
          <g className="avatar-hit-zone" onClick={handlePocketClick('left')}>
            <path
              d="M134 452 L212 456 L208 518 L138 514 Z"
              fill="#c9cdc7"
              stroke="#18181b"
              strokeWidth="2.1"
              strokeLinejoin="round"
            />
            <g ref={leftPocketFlapRef}>
              <path
                d="M132 452 L214 456 L210 478 L173 488 L135 474 Z"
                fill="#dce0da"
                stroke="#18181b"
                strokeWidth="2.1"
                strokeLinejoin="round"
              />
              <circle cx="173" cy="476" r="4.5" fill="#b7bcc0" stroke="#18181b" strokeWidth="1.6" />
              <circle cx="171.8" cy="474.8" r="1.4" fill="#eef1f3" />
            </g>
          </g>

          {/* Right chest flap pocket (clickable pocket pop!) */}
          <g className="avatar-hit-zone" onClick={handlePocketClick('right')}>
            <path
              d="M348 456 L426 452 L422 514 L352 518 Z"
              fill="#c9cdc7"
              stroke="#18181b"
              strokeWidth="2.1"
              strokeLinejoin="round"
            />
            <g ref={rightPocketFlapRef}>
              <path
                d="M346 456 L428 452 L425 474 L387 488 L350 478 Z"
                fill="#dce0da"
                stroke="#18181b"
                strokeWidth="2.1"
                strokeLinejoin="round"
              />
              <circle cx="387" cy="476" r="4.5" fill="#b7bcc0" stroke="#18181b" strokeWidth="1.6" />
              <circle cx="385.8" cy="474.8" r="1.4" fill="#eef1f3" />
            </g>
          </g>

          {/* Jacket buttons along lower placket */}
          <circle cx="218" cy="648" r="4.5" fill="#b7bcc0" stroke="#18181b" strokeWidth="1.6" />
          <circle cx="219" cy="708" r="4.5" fill="#b7bcc0" stroke="#18181b" strokeWidth="1.6" />
          <circle cx="342" cy="648" r="4.5" fill="#b7bcc0" stroke="#18181b" strokeWidth="1.6" />
          <circle cx="341" cy="708" r="4.5" fill="#b7bcc0" stroke="#18181b" strokeWidth="1.6" />

          {/* Sharp folded jacket lapels / collar (with secondary breath follow-through) */}
          <g ref={leftCollarRef}>
            <path
              d="M216 312 L172 374 L216 402 L226 355 Z"
              fill="#e3e6e1"
              stroke="#18181b"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path d="M210 330 L186 368" stroke="#9da39c" strokeWidth="1.6" strokeLinecap="round" />
          </g>
          <g ref={rightCollarRef}>
            <path
              d="M344 312 L388 374 L344 402 L334 355 Z"
              fill="#e3e6e1"
              stroke="#18181b"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path d="M350 330 L374 368" stroke="#9da39c" strokeWidth="1.6" strokeLinecap="round" />
          </g>

          {/* Jacket crease lines */}
          <path
            d="M118 408 Q130 465 124 520 M442 408 Q430 465 436 520"
            stroke="#18181b"
            strokeWidth="1.9"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M148 634 Q158 690 152 745 M412 634 Q402 690 408 745"
            stroke="#7d837c"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* ==================== CROSSED ARMS SUBGROUP ==================== */}
          <g ref={armsRef}>
            {/* Shadow cast by crossed arms onto jacket */}
            <path
              d="M96 588 Q280 626 462 590 L452 626 Q280 656 106 624 Z"
              fill="#18181b"
              opacity="0.18"
            />

            {/* Right forearm skin peeking on the viewer's left (articulated counter-motion) */}
            <g ref={rightForearmRef}>
              <path
                d="M146 534 C168 524, 212 522, 240 534 L236 576 C198 580, 162 574, 144 562 C136 556, 138 538, 146 534 Z"
                fill="url(#avHandGrad)"
                stroke="#18181b"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path
                d="M150 554 Q188 564 232 558"
                stroke="#a86f4c"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.55"
              />
            </g>

            {/* Right sleeve (viewer's left, lower arm tucked across) */}
            <path
              d="M52 504 C44 552, 54 600, 96 618 C128 632, 224 624, 314 606 L310 546 C236 558, 166 562, 136 548 C124 542, 120 518, 124 494"
              fill="url(#avJacketSleeve)"
              stroke="#18181b"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M50 492 C48 518, 52 540, 66 552 L124 522 C122 504, 124 490, 124 484 Z"
              fill="url(#avJacketSleeve)"
            />
            <path
              d="M96 562 Q144 584 218 582 M118 592 Q174 606 252 596"
              stroke="#18181b"
              strokeWidth="1.9"
              strokeLinecap="round"
              opacity="0.5"
            />

            {/* Articulated Left Hand (resting over right arm — finger tap & wave gesture!) */}
            <g
              ref={leftHandRef}
              className="avatar-hit-zone"
              onMouseEnter={(e) => {
                e.stopPropagation();
                setHoverZone('hand');
              }}
              onMouseLeave={() => setHoverZone('torso')}
              onClick={handleHandClick}
            >
              {/* Wrist & Palm base */}
              <path
                d="M362 538 C374 510, 396 486, 420 478 L434 542 L392 550 Z"
                fill="url(#avHandGrad)"
                stroke="#18181b"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              {/* Knuckle/tendon warm shade */}
              <path
                d="M380 524 Q398 506 418 492"
                stroke="#b07652"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.55"
              />

              {/* Finger 3 (Ring & Pinky — bottom) */}
              <g ref={finger3Ref}>
                <path
                  d="M412 518 C428 516, 448 518, 460 524 C467 528, 466 537, 458 540 C446 544, 428 544, 412 540 Z"
                  fill="url(#avHandGrad)"
                  stroke="#18181b"
                  strokeWidth="2.3"
                  strokeLinejoin="round"
                />
              </g>

              {/* Finger 2 (Middle) */}
              <g ref={finger2Ref}>
                <path
                  d="M414 498 C432 494, 454 494, 468 500 C475 504, 474 515, 464 518 C450 522, 430 522, 414 518 Z"
                  fill="url(#avHandGrad)"
                  stroke="#18181b"
                  strokeWidth="2.3"
                  strokeLinejoin="round"
                />
              </g>

              {/* Finger 1 (Index — top) */}
              <g ref={finger1Ref}>
                <path
                  d="M410 478 C428 470, 448 467, 461 473 C468 477, 467 488, 458 492 C444 497, 426 498, 412 496 Z"
                  fill="url(#avHandGrad)"
                  stroke="#18181b"
                  strokeWidth="2.3"
                  strokeLinejoin="round"
                />
                {/* Subtle highlight along index finger */}
                <path
                  d="M422 478 Q440 474 454 477"
                  stroke="#f0c8a8"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              </g>
            </g>

            {/* Left forearm sleeve (in front, crossing from right elbow to left) */}
            <path
              d="M508 504 C516 552, 506 600, 462 620 C422 638, 304 606, 208 584 L224 518 C312 538, 398 554, 430 544 C442 540, 444 516, 440 492"
              fill="url(#avJacketMain)"
              stroke="#18181b"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Front sleeve cuff */}
            <path
              d="M208 584 L224 518 L266 527 L252 593 Z"
              fill="#e1e4df"
              stroke="#18181b"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            {/* Cuff button */}
            <circle cx="241" cy="569" r="4.2" fill="#b7bcc0" stroke="#18181b" strokeWidth="1.6" />
            <circle cx="240" cy="568" r="1.2" fill="#eef1f3" />

            {/* Crisp folds & shadow on front crossed sleeve */}
            <path
              d="M276 556 Q348 574 426 568 M296 582 Q364 598 442 590"
              stroke="#18181b"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
            <path
              d="M266 536 Q344 552 418 552"
              stroke="#eff2ee"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.65"
            />
          </g>

          {/* ==================== NECK GROUP (seamless trapezius blend into crew-neck!) ==================== */}
          <g ref={neckRef}>
            {/* Smooth neck skin fill blending cleanly into upper chest (no harsh bottom outline!) */}
            <path
              d="M248 256 C248 232, 312 232, 312 256 L326 342 C312 364, 248 364, 234 342 Z"
              fill="url(#avNeckGrad)"
            />
            {/* Clean left & right neck-side ink lines stopping cleanly inside the collar */}
            <path
              d="M248 256 L238 332"
              stroke="#18181b"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M312 256 L322 332"
              stroke="#18181b"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Chin cast shadow on upper neck */}
            <path
              d="M248 258 C260 294, 300 294, 312 258 L315 282 C298 308, 262 308, 245 282 Z"
              fill="#8c5739"
              opacity="0.58"
            />
            {/* Subtle sternocleidomastoid & collarbone lines */}
            <path
              d="M255 294 Q265 324 274 344 M305 294 Q295 324 286 344"
              stroke="#9a6445"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
            <path
              d="M236 348 Q256 356 271 351 M324 348 Q304 356 289 351"
              stroke="#a8704e"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.55"
            />

            {/* ==================== HEAD GROUP (nested inside neck — forward kinematics!) ==================== */}
            <g ref={headRef}>
          {/* Back hair layer */}
          <g ref={backHairRef}>
            <path
              d="M196 196 C178 164, 174 118, 198 84 C216 58, 246 42, 280 44 C314 42, 344 58, 362 84 C386 118, 382 164, 364 196 C358 176, 352 152, 342 132 L218 132 C208 152, 202 176, 196 196 Z"
              fill="#171514"
              stroke="#18181b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </g>

          {/* Ears layer (clickable for playful head shake!) */}
          <g ref={earsRef} className="avatar-hit-zone" onClick={handleEarClick}>
            <path
              d="M206 184 C194 180, 188 194, 192 212 C196 228, 206 236, 214 232"
              fill="#cf9671"
              stroke="#18181b"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M203 196 C198 202, 199 216, 206 222"
              stroke="#9a6445"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M354 184 C366 180, 372 194, 368 212 C364 228, 354 236, 346 232"
              fill="#cf9671"
              stroke="#18181b"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M357 196 C362 202, 361 216, 354 222"
              stroke="#9a6445"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* Sculpted face silhouette (hover for sunglasses peek + brow cock + wink) */}
          <g
            className="avatar-hit-zone"
            onMouseEnter={() => setHoverZone('face')}
            onMouseLeave={() => setHoverZone('none')}
            onClick={handleToggleShades}
          >
            <path
              d="M208 132 C206 168, 206 206, 216 232 C226 254, 254 276, 280 278 C306 276, 334 254, 344 232 C354 206, 354 168, 352 132 C350 96, 322 76, 280 76 C238 76, 210 96, 208 132 Z"
              fill="url(#avSkinBase)"
              stroke="#18181b"
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <path
              ref={cheekGlowRef}
              d="M222 208 Q232 216 244 214 M338 208 Q328 216 316 214"
              stroke="#f0c8a8"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.55"
            />
            <path
              d="M214 128 Q280 144 346 128 L346 112 Q280 100 214 112 Z"
              fill="#a8704e"
              opacity="0.28"
            />
          </g>

          {/* ==================== FACIAL FEATURES (2.5D forward parallax) ==================== */}
          <g
            ref={faceFeaturesRef}
            className="avatar-hit-zone"
            onMouseEnter={() => setHoverZone('face')}
            onMouseLeave={() => setHoverZone('none')}
            onClick={handleToggleShades}
          >
            {/* EYES (Revealed on face hover peek or click!) */}
            <g ref={eyesGroupRef}>
              {/* Left eye */}
              <path
                d="M222 173 Q244 160 264 173 Q244 184 222 173 Z"
                fill="#f6f3ef"
                stroke="#18181b"
                strokeWidth="2.1"
                strokeLinejoin="round"
              />
              <g clipPath="url(#avLeftEyeClip)">
                <g ref={leftPupilRef}>
                  <circle cx="244" cy="173" r="8.2" fill="#3a2417" />
                  <circle cx="244" cy="173" r="6.2" fill="#5c3923" />
                  <circle cx="244" cy="173" r="3.9" fill="#110b08" />
                  <circle cx="246.8" cy="170.2" r="2.1" fill="#ffffff" />
                  <circle cx="241.5" cy="175.8" r="1" fill="#ffffff" opacity="0.7" />
                </g>
                <path d="M220 165 Q244 159 266 165 L266 170 Q244 165 220 170 Z" fill="#18181b" opacity="0.22" />
              </g>
              <path d="M221 173 Q244 159 265 173" stroke="#18181b" strokeWidth="3.2" strokeLinecap="round" />
              <rect
                ref={leftEyelidRef}
                x="219"
                y="160"
                width="48"
                height="26"
                rx="6"
                fill="#d49b76"
                transform="translate(244 173) scale(1, 0) translate(-244 -173)"
              />

              {/* Right eye (supports independent wink!) */}
              <path
                d="M296 173 Q316 160 338 173 Q316 184 296 173 Z"
                fill="#f6f3ef"
                stroke="#18181b"
                strokeWidth="2.1"
                strokeLinejoin="round"
              />
              <g clipPath="url(#avRightEyeClip)">
                <g ref={rightPupilRef}>
                  <circle cx="316" cy="173" r="8.2" fill="#3a2417" />
                  <circle cx="316" cy="173" r="6.2" fill="#5c3923" />
                  <circle cx="316" cy="173" r="3.9" fill="#110b08" />
                  <circle cx="318.8" cy="170.2" r="2.1" fill="#ffffff" />
                  <circle cx="313.5" cy="175.8" r="1" fill="#ffffff" opacity="0.7" />
                </g>
                <path d="M294 165 Q316 159 340 165 L340 170 Q316 165 294 170 Z" fill="#18181b" opacity="0.22" />
              </g>
              <path d="M295 173 Q316 159 339 173" stroke="#18181b" strokeWidth="3.2" strokeLinecap="round" />
              <rect
                ref={rightEyelidRef}
                x="293"
                y="160"
                width="48"
                height="26"
                rx="6"
                fill="#d49b76"
                transform="translate(316 173) scale(1, 0) translate(-316 -173)"
              />
            </g>

            {/* Nose (clickable boop!) */}
            <g className="avatar-hit-zone" onClick={handleNoseBoop}>
              <circle cx="280" cy="202" r="14" fill="transparent" />
              <path
                d="M276 178 L272 204 C271 210, 275 213, 280 213 C285 213, 289 210, 288 205"
                stroke="#18181b"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M273 206 C276 211, 284 211, 287 206"
                stroke="#9a6445"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d="M279 182 L278 202"
                stroke="#efc7a7"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.65"
              />
            </g>

            {/* Disconnected Mustache (lifts subtly while speaking) */}
            <path
              ref={mustacheRef}
              d="M254 229 C260 221, 272 219, 280 221 C288 219, 300 221, 306 229 C300 226, 289 225, 280 226 C271 225, 260 226, 254 229 Z"
              fill="url(#avBeardGrad)"
              stroke="#18181b"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Disconnected Chin Beard + Soul Patch (drops in sync with lower jaw while talking) */}
            <path
              ref={chinBeardRef}
              d="M254 258 C261 261, 270 262, 275 260 L275 250 Q280 247 285 250 L285 260 C290 262, 299 261, 306 258 C303 270, 293 278, 280 279 C267 278, 257 270, 254 258 Z"
              fill="url(#avBeardGrad)"
              stroke="#18181b"
              strokeWidth="1.9"
              strokeLinejoin="round"
            />

            {/* Confident Smirk + Animated Talking Mouth */}
            <g ref={mouthRef}>
              <g ref={smirkRef}>
                <path
                  d="M258 237 C269 240, 288 239, 302 233"
                  stroke="#18181b"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M271 243 Q280 245 289 242"
                  stroke="#a86f4c"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </g>

              {/* Sad / Broke Frown Mouth */}
              <g ref={sadMouthRef} opacity="0">
                <path
                  d="M261 241 C271 234, 289 234, 299 241"
                  stroke="#18181b"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M273 244 Q280 242 287 244"
                  stroke="#a86f4c"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </g>

              {/* Big Rounded Yawn Mouth (after 5s inactivity) */}
              <g ref={yawnMouthRef} opacity="0">
                <ellipse
                  cx="280"
                  cy="240"
                  rx="13"
                  ry="11.5"
                  fill="#381818"
                  stroke="#18181b"
                  strokeWidth="2.2"
                />
                <path
                  d="M270 233 Q280 230.5 290 233 L289 236 Q280 236.5 271 236 Z"
                  fill="#f7f5f2"
                />
                <path
                  d="M272 248 Q280 243 288 248 C285 251, 275 251, 272 248 Z"
                  fill="#b85454"
                />
              </g>

              {/* Open Talking Mouth (scales smoothly during speech) */}
              <g ref={talkMouthRef} opacity="0">
                <path
                  d="M261 233 Q280 231 299 233 C300 243, 291 248, 280 248 C269 248, 260 243, 261 233 Z"
                  fill="#381818"
                  stroke="#18181b"
                  strokeWidth="2.1"
                  strokeLinejoin="round"
                />
                {/* Crisp upper teeth */}
                <path
                  d="M264 234 Q280 232.5 296 234 L295 237.5 Q280 238.5 265 237.5 Z"
                  fill="#f7f5f2"
                />
                {/* Subtle warm tongue */}
                <path
                  d="M269 245 Q280 241 291 245 C288 247.5, 272 247.5, 269 245 Z"
                  fill="#b85454"
                />
              </g>
            </g>

            {/* Independent Expressive Eyebrows */}
            <g ref={leftBrowRef}>
              <path
                d="M214 152 C226 144, 250 144, 267 152 L265 159 C248 153, 228 153, 214 158 Z"
                fill="#1f1a17"
                stroke="#18181b"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </g>
            <g ref={rightBrowRef}>
              <path
                d="M346 152 C334 144, 310 144, 293 152 L295 159 C312 153, 332 153, 346 158 Z"
                fill="#1f1a17"
                stroke="#18181b"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </g>

            {/* ==================== SUNGLASSES GROUP ==================== */}
            <g ref={sunglassesRef}>
              <path
                d="M198 164 L206 166 M362 164 L354 166"
                stroke="#18181b"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <path
                d="M201 162 C214 152, 258 151, 272 162 L288 162 C302 151, 346 152, 359 162 C362 195, 343 214, 315 211 C292 208, 286 184, 284 173 L276 173 C274 184, 268 208, 245 211 C217 214, 198 195, 201 162 Z"
                fill="#191b1f"
                stroke="#0c0d10"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path
                d="M206 159 C220 153, 254 153, 269 160 M291 160 C306 153, 340 153, 354 159"
                stroke="#5b616c"
                strokeWidth="1.8"
                strokeLinecap="round"
                opacity="0.85"
              />

              {/* Left Lens */}
              <path
                d="M206 164 C216 156, 255 156, 267 166 C271 178, 266 203, 245 206 C220 209, 204 192, 206 164 Z"
                fill="url(#avLensGrad)"
              />
              <g clipPath="url(#avLeftLensClip)">
                <g ref={lensShineLeftRef}>
                  <path d="M214 148 L234 148 L216 216 L196 216 Z" fill="#ffffff" opacity="0.18" />
                  <path d="M242 148 L250 148 L232 216 L224 216 Z" fill="#ffffff" opacity="0.11" />
                </g>
              </g>

              {/* Right Lens */}
              <path
                d="M293 166 C305 156, 344 156, 354 164 C356 192, 340 209, 315 206 C294 203, 289 178, 293 166 Z"
                fill="url(#avLensGrad)"
              />
              <g clipPath="url(#avRightLensClip)">
                <g ref={lensShineRightRef}>
                  <path d="M306 148 L326 148 L308 216 L288 216 Z" fill="#ffffff" opacity="0.22" />
                  <path d="M334 148 L342 148 L324 216 L316 216 Z" fill="#ffffff" opacity="0.13" />
                </g>
              </g>

              {/* Signature 4-Point Star Glint */}
              <g
                className={`avatar-star-glint ${glintFlash ? 'avatar-star-glint--flash' : ''}`}
                filter="url(#avGlintGlow)"
              >
                <path
                  d="M348 134 L352 156 L374 160 L352 164 L348 186 L344 164 L322 160 L344 156 Z"
                  fill="#ffffff"
                />
                <circle cx="348" cy="160" r="5" fill="#ffffff" />
              </g>
            </g>
          </g>

          {/* ==================== FRONT PARTED HAIR (Hover sway & click rustle) ==================== */}
          <g
            ref={frontHairRef}
            className="avatar-hit-zone"
            onMouseEnter={() => setHoverZone('hair')}
            onMouseLeave={() => setHoverZone('none')}
            onClick={handleHairClick}
          >
            <path
              d="M202 184 C184 166, 174 134, 184 102 C178 96, 186 82, 198 76 C206 54, 232 42, 258 46 C266 34, 286 30, 298 42 C324 38, 352 52, 362 76 C374 82, 382 96, 376 102 C386 134, 376 166, 358 184 C354 154, 344 132, 326 116 C318 128, 308 138, 302 144 C308 124, 304 104, 288 94 C284 104, 276 114, 266 122 C272 106, 268 94, 256 96 C236 106, 224 128, 214 148 C210 162, 206 174, 202 184 Z"
              fill="url(#avHairGrad)"
              stroke="#18181b"
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
            <path
              ref={bangLeftRef}
              d="M254 94 C238 112, 232 130, 236 146 C244 130, 254 114, 268 102"
              fill="#231f1d"
              stroke="#18181b"
              strokeWidth="2.1"
              strokeLinejoin="round"
            />
            <path
              ref={bangRightRef}
              d="M294 92 C312 110, 322 128, 316 146 C308 128, 298 112, 284 100"
              fill="#231f1d"
              stroke="#18181b"
              strokeWidth="2.1"
              strokeLinejoin="round"
            />
            <path
              d="M214 88 C230 68, 254 62, 272 68 M346 88 C330 68, 306 62, 288 68"
              stroke="#4a4440"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.72"
            />
            <path
              d="M198 124 C206 104, 222 90, 240 84 M362 124 C354 104, 338 90, 320 84"
              stroke="#3a3532"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M278 48 C276 66, 278 82, 282 94"
              stroke="#111010"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>

          {/* Anime/Comic Blue Sweat-Drop on temple when broke! */}
          <g className={`avatar-sweat ${brokeFx ? 'avatar-sweat--active' : ''}`} aria-hidden="true">
            <path
              d="M346 130 C346 130, 355 144, 355 151 C355 156, 351 160, 346 160 C341 160, 337 156, 337 151 C337 144, 346 130, 346 130 Z"
              fill="#7dd3fc"
              stroke="#18181b"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M343 149 C342 152, 343 155, 345 156"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>
            </g>
          </g>
        </g>

        {/* Comic Sparkle Burst FX (triggers on double-click, pocket pop, or 3-tap combo) */}
        <g
          className={`avatar-sparkles ${sparkleBurst ? 'avatar-sparkles--active' : ''}`}
          aria-hidden="true"
        >
          <path
            d="M156 122 L160 136 L174 140 L160 144 L156 158 L152 144 L138 140 L152 136 Z"
            fill="#ffffff"
            stroke="#18181b"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M406 106 L409 117 L420 120 L409 123 L406 134 L403 123 L392 120 L403 117 Z"
            fill="#ffffff"
            stroke="#18181b"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M126 232 L128.5 240 L136.5 242.5 L128.5 245 L126 253 L123.5 245 L115.5 242.5 L123.5 240 Z"
            fill="#ffffff"
            stroke="#18181b"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M432 254 L434.5 262 L442.5 264.5 L434.5 267 L432 275 L429.5 267 L421.5 264.5 L429.5 262 Z"
            fill="#ffffff"
            stroke="#18181b"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}

export default InteractiveAvatar2D;
