import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTheme } from "../../contexts/ThemeContext";
import Lanyard from "../ui/Lanyard";
import { createIdCardTextures } from "../../utils/idCardTexture";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_QUERY = "(min-width: 768px)";

const SEGMENTS = [
  { text: "Building", bold: false },
  { text: "full-stack web apps", bold: true },
  { text: "and", bold: false },
  { text: "Docker & CI/CD pipelines", bold: true },
  { text: "that run reliably in", bold: false },
  { text: "production.", bold: true },
];

const STATEMENT = SEGMENTS.map((s) => s.text).join(" ");

let globalCharIndex = 0;
const WORDS = SEGMENTS.flatMap((seg) =>
  seg.text.split(" ").map((word) => ({
    chars: Array.from(word).map((ch) => ({ ch, idx: globalCharIndex++ })),
    bold: seg.bold,
  }))
);

export default function AboutSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(DESKTOP_QUERY).matches : true
  );
  const [mobileRevealed, setMobileRevealed] = useState(false);
  const [cardFaces, setCardFaces] = useState({
    front: "/lanyard-avatar.jpg",
    back: "/lanyard-avatar.jpg",
  });

  const sectionRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let active = true;
    createIdCardTextures("/lanyard-avatar.jpg", isDark).then((faces) => {
      if (active) setCardFaces(faces);
    });
    return () => {
      active = false;
    };
  }, [isDark]);

  // Mobile (< 768px): React-state-driven reveal so re-renders (e.g. Lanyard texture load)
  // never overwrite inline opacity back to 0.14.
  useEffect(() => {
    if (isDesktop) return undefined;
    const root = sectionRef.current;
    if (!root) return undefined;

    if (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setMobileRevealed(true);
      return undefined;
    }

    const reveal = () => setMobileRevealed(true);

    const rect = root.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      reveal();
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    io.observe(root);

    const stackSection = root.closest(".stack-section");
    const onStackActive = (e) => {
      if (e.detail?.active) {
        reveal();
        io.disconnect();
      }
    };
    stackSection?.addEventListener("stackactivechange", onStackActive);

    return () => {
      io.disconnect();
      stackSection?.removeEventListener("stackactivechange", onStackActive);
    };
  }, [isDesktop]);

  // Desktop (>= 768px): GSAP scroll-scrubbed character wave phase-locked to Lenis
  useGSAP(
    () => {
      if (!isDesktop) return undefined;
      const root = sectionRef.current;
      const textEl = textRef.current;
      if (!root || !textEl) return undefined;

      const chars = Array.from(textEl.querySelectorAll(".about-char"));
      if (!chars.length) return undefined;

      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        chars.forEach((el) => {
          gsap.set(el, { opacity: el.dataset.bold === "true" ? 1 : 0.68 });
        });
        return undefined;
      }

      const triggerEl = root.closest(".stack-section") || root;
      gsap.fromTo(
        chars,
        { opacity: 0.14 },
        {
          opacity: (i, el) => (el.dataset.bold === "true" ? 1 : 0.68),
          duration: 1.35,
          ease: "sine.inOut",
          stagger: 0.032,
          scrollTrigger: {
            trigger: triggerEl,
            start: "top 65%",
            end: "bottom 95%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return undefined;
    },
    { scope: sectionRef, dependencies: [isDesktop] }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative w-full md:min-h-[150vh]"
      style={{
        background: "var(--surface)",
        color: "var(--foam)",
      }}
    >
      <div
        className="relative w-full min-h-[100dvh] flex flex-col justify-between md:flex-row md:items-center md:sticky md:top-0 overflow-hidden"
        style={{ contain: "layout paint" }}
      >
        {/* Text layer (pointer-events-none on desktop so the 3D ID card can be dragged anywhere) */}
        <div
          className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-col md:flex-row items-center px-6 sm:px-8 md:px-[clamp(1.5rem,3.5vw,3rem)]"
          style={{
            paddingTop: isDesktop ? "calc(var(--header-h) + 1.5rem)" : "calc(var(--header-h) + 2.5rem)",
            paddingBottom: isDesktop ? "calc(var(--dock-h) + 1.5rem)" : "0.75rem",
            pointerEvents: isDesktop ? "none" : "auto",
          }}
        >
          {/* Left breathing space for the hanging 3D ID card on desktop */}
          <div className="hidden md:block md:w-[37%] shrink-0" aria-hidden="true" />

          {/* Right on desktop, centered top on mobile */}
          <div className="w-full md:w-[63%] flex flex-col justify-center items-center md:items-start">
            <h2
              id="about-heading"
              ref={textRef}
              aria-label={STATEMENT}
              className="m-0 w-full max-w-[18ch] md:max-w-none text-center md:text-left"
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: isDesktop
                  ? "clamp(2.2rem, 4.2vw, 4rem)"
                  : "clamp(1.75rem, 7.2vw, 2.45rem)",
                lineHeight: isDesktop ? 1.24 : 1.26,
                letterSpacing: "-0.03em",
                color: "var(--foam)",
                textWrap: "balance",
              }}
            >
              {WORDS.map((item, wi) => (
                <span
                  key={wi}
                  aria-hidden="true"
                  className="inline-block whitespace-nowrap"
                  style={{
                    fontWeight: item.bold ? 800 : 400,
                    letterSpacing: item.bold ? "-0.036em" : "-0.018em",
                    marginRight: wi < WORDS.length - 1 ? "0.24em" : 0,
                  }}
                >
                  {item.chars.map(({ ch, idx }) => (
                    <span
                      key={idx}
                      data-bold={item.bold ? "true" : "false"}
                      className="about-char inline-block"
                      style={
                        isDesktop
                          ? undefined
                          : {
                              opacity: mobileRevealed ? (item.bold ? 1 : 0.72) : 0.14,
                              transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 14}ms`,
                            }
                      }
                    >
                      {ch}
                    </span>
                  ))}
                </span>
              ))}
            </h2>
          </div>
        </div>

        {/* Interactive 3D Lanyard: below text with dock clearance on mobile, full-section draggable on desktop */}
        <div
          className="relative w-full h-[360px] sm:h-[420px] touch-pan-y md:absolute md:inset-0 md:h-full z-20"
          style={{
            marginBottom: isDesktop ? 0 : "calc(var(--dock-h) + 1rem)",
          }}
          aria-label="Interactive 3D ID badge"
        >
          <Lanyard
            frontImage={cardFaces.front}
            backImage={cardFaces.back}
            imageFit="cover"
            cardColor={isDark ? "#121215" : "#f8fafc"}
            strapColor={isDark ? "#18181b" : "#27272a"}
            finish="matte"
            metal={isDark ? "silver" : "graphite"}
            size={isDesktop ? 0.68 : 0.7}
            strapLength={isDesktop ? 0.3 : 0.24}
            anchor={isDesktop ? 0.2 : "center"}
            breeze={0}
            interactive={true}
            intro={false}
          />
        </div>
      </div>
    </section>
  );
}
