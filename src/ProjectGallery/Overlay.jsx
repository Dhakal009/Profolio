import { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

/* ------------------------------------------------------------------ */
/*  DEFAULTS – replace later per project in your projects data file:   */
/*    screenshots: ['/shots/a.png', '/shots/b.png', ...]               */
/*    credentials: { role, email, password }  (or an array of these)   */
/* ------------------------------------------------------------------ */
const DEFAULT_CREDENTIALS = [
  { role: 'Demo user', email: 'demo@example.com', password: 'Demo@1234' }
]

const SHOT_LABELS = ['Dashboard', 'Detail view', 'Settings']

const makePlaceholder = (label, accent = '#38bdf8') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800">
<rect width="1280" height="800" fill="#12131a"/>
<rect width="220" height="800" fill="#181a23"/>
<rect x="28" y="32" width="120" height="16" rx="8" fill="${accent}"/>
${[0, 1, 2, 3, 4].map((i) => `<rect x="28" y="${110 + i * 44}" width="${150 - (i % 3) * 24}" height="12" rx="6" fill="#2a2d3a"/>`).join('')}
<rect x="260" y="32" width="420" height="22" rx="11" fill="#2a2d3a"/>
${[0, 1, 2].map((i) => `<rect x="${260 + i * 330}" y="100" width="300" height="130" rx="16" fill="#1d1f2b"/><rect x="${284 + i * 330}" y="126" width="90" height="12" rx="6" fill="#3a3e50"/><rect x="${284 + i * 330}" y="160" width="150" height="30" rx="8" fill="${accent}" opacity="${0.9 - i * 0.2}"/>`).join('')}
<rect x="260" y="262" width="640" height="300" rx="16" fill="#1d1f2b"/>
<polyline points="290,520 380,450 470,480 560,390 650,420 740,340 860,370" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="930" y="262" width="300" height="300" rx="16" fill="#1d1f2b"/>
${[0, 1, 2, 3].map((i) => `<rect x="956" y="${292 + i * 62}" width="248" height="42" rx="10" fill="#262938"/>`).join('')}
<rect x="260" y="594" width="970" height="160" rx="16" fill="#1d1f2b"/>
<text x="640" y="780" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#6b7080">${label} · placeholder</text>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

/* ------------------------------ Icons ------------------------------ */
const ExternalIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

/* --------------------------- Intro screen --------------------------- */
const IntroScreen = styled.div.attrs((props) => ({
  style: {
    opacity: props.$bgOpacity,
    transform: `translate3d(0, ${props.$translateY}px, 0)`,
    background: props.$isDark
      ? `rgba(0, 0, 0, ${0.94 * props.$bgOpacity})`
      : `rgba(244, 244, 246, ${0.94 * props.$bgOpacity})`,
    pointerEvents: 'none'
  }
}))`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  z-index: 20;
  overflow: hidden;
  will-change: opacity, transform;
  transition: opacity 0.18s ease-out, transform 0.18s ease-out;
`

const IntroTitle = styled.h1.attrs((props) => ({
  style: {
    transform: `translate3d(0, 0, 0) scale(${props.$scale})`,
    opacity: props.$textOpacity,
    letterSpacing: `${props.$letterSpacing}em`
  }
}))`
  font-family: 'Inter Tight', Inter, system-ui, sans-serif;
  font-size: clamp(3.5rem, 13vw, 11rem);
  font-weight: 800;
  line-height: 0.9;
  margin: 0;
  color: ${(props) => (props.$isDark ? '#ffffff' : '#09090b')};
  letter-spacing: -0.07em;
  max-width: 1200px;
  transform-origin: center center;
  will-change: transform, opacity;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
`

const IntroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;

  &::after {
    content: '';
    width: clamp(4rem, 12vw, 8rem);
    height: 2px;
    background: ${(p) => (p.$isDark ? '#38bdf8' : '#0284c7')};
    transform-origin: left;
    animation: introLine 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  user-select: none;

  &.is-opening .opening-word {
    display: inline-block;
    opacity: 0;
    animation: wordRise 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  &.is-opening .opening-word:nth-child(1) { animation-delay: 0.04s; }
  &.is-opening .opening-word:nth-child(2) { animation-delay: 0.12s; }
  &.is-opening .opening-word:nth-child(3) { animation-delay: 0.20s; }
  &.is-opening .opening-word:nth-child(4) { animation-delay: 0.28s; }

  @keyframes wordRise {
    0% { opacity: 0; transform: translateY(28px) scale(0.92); filter: blur(10px); }
    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
  }

  @keyframes introLine {
    from { opacity: 0; transform: scaleX(0); }
    to { opacity: 1; transform: scaleX(1); }
  }

  @media (max-width: 860px) {
    height: auto;
    max-height: calc(100dvh - 1rem);
    overflow-y: auto;
    padding: 1rem;
  }
`

const IntroKicker = styled.span`
  color: ${(p) => (p.$isDark ? 'rgba(255,255,255,0.58)' : 'rgba(9,9,11,0.55)')};
  font: 600 0.7rem/1 var(--font-mono, ui-monospace, monospace);
  letter-spacing: 0.16em;
  text-transform: uppercase;
`

/* ------------------------------ Modal ------------------------------ */
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(0.75rem, 3vw, 2rem);
  background: ${(p) => (p.$isDark ? 'rgba(4, 4, 6, 0.8)' : 'rgba(235, 235, 240, 0.8)')};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: opacity 0.22s ease-in;
  opacity: ${(p) => (p.$isClosing ? 0 : 1)};
  animation: fadeIn 0.25s ease-out;

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
`

const Scene = styled.div`
  perspective: 1600px;
  width: min(96vw, 1180px);
`

const Tilt = styled.div`
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.18s ease-out;
  will-change: transform;

  /* floating shadow layer sits behind the card to create depth */
  &::before {
    content: '';
    position: absolute;
    inset: 18px 14px -22px;
    border-radius: 32px;
    background: ${(p) => p.$accent || (p.$isDark ? '#38bdf8' : '#0284c7')};
    opacity: ${(p) => (p.$isDark ? 0.22 : 0.18)};
    filter: blur(46px);
    transform: translateZ(-70px);
    pointer-events: none;
  }
`

const ModalCard = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: min(92dvh, 820px);
  max-height: calc(100dvh - 2rem);
  overflow: hidden;
  border-radius: 24px;
  padding: clamp(1rem, 2.2vw, 1.65rem);
  background: ${(p) =>
    p.$isDark
      ? 'linear-gradient(160deg, rgba(28, 29, 38, 0.97), rgba(14, 14, 19, 0.98))'
      : 'linear-gradient(160deg, rgba(255, 255, 255, 1), rgba(246, 246, 250, 0.98))'};
  border: 1px solid ${(p) => (p.$isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)')};
  box-shadow: ${(p) =>
    p.$isDark
      ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 40px 90px rgba(0,0,0,0.75), 0 10px 24px rgba(0,0,0,0.5)'
      : 'inset 0 1px 0 #fff, 0 40px 80px rgba(20,20,40,0.18), 0 8px 20px rgba(20,20,40,0.1)'};
  color: ${(p) => (p.$isDark ? '#f4f4f5' : '#09090b')};
  transition: transform 0.22s ease-in, opacity 0.2s ease-in;
  transform: ${(p) => (p.$isClosing ? 'scale(0.95) translateY(20px)' : 'none')};
  opacity: ${(p) => (p.$isClosing ? 0 : 1)};
  animation: popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  scrollbar-width: thin;

  @keyframes popIn {
    from { transform: scale(0.94) translateY(16px) rotateX(6deg); opacity: 0; }
    to { transform: none; opacity: 1; }
  }
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.65rem;
`

const Badges = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
`

const CategoryBadge = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  background: ${(p) => (p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')};
  color: ${(p) => (p.$isDark ? '#e4e4e7' : '#3f3f46')};
`

const StatusDot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #10b981;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgba(16, 185, 129, 0.12);

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 8px currentColor;
  }
`

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid ${(p) => (p.$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)')};
  background: ${(p) => (p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)')};
  color: currentColor;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s, transform 0.2s;

  &:hover { background: ${(p) => (p.$isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.12)')}; transform: scale(1.06); }
  &:focus-visible { outline: 2px solid ${(p) => p.$accent || '#38bdf8'}; outline-offset: 2px; }
`

const Header = styled.div`
  margin-bottom: 0.8rem;
  flex: 0 0 auto;
`

const ProjectTitle = styled.h2`
  font-size: clamp(1.65rem, 3.4vw, 2.55rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.08;
  margin: 0 0 0.4rem;
`

const ProjectSubtitle = styled.p`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${(p) => p.$accent || (p.$isDark ? '#38bdf8' : '#0284c7')};
  margin: 0;
`

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: start;
  flex: 1;
  height: auto;
  min-height: 0;

  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr);
    flex: 1 1 auto;
    overflow-y: auto;
    padding-right: 0.15rem;
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  min-width: 0;
  min-height: 0;

  &:last-child {
    overflow-y: auto;
    padding-right: 0.25rem;
    scrollbar-width: thin;
  }
`

/* ----- Screenshot viewer (browser frame with slight 3D lean) ----- */
const BrowserFrame = styled.div`
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid ${(p) => (p.$isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)')};
  background: ${(p) => (p.$isDark ? '#0d0e13' : '#fff')};
  box-shadow: ${(p) =>
    p.$isDark
      ? '0 30px 50px -18px rgba(0,0,0,0.8), 0 12px 20px -10px rgba(0,0,0,0.6)'
      : '0 30px 50px -18px rgba(20,20,40,0.3), 0 12px 20px -10px rgba(20,20,40,0.18)'};
  transform: perspective(1200px) rotateY(-4deg) rotateX(2deg);
  transform-origin: center;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover { transform: perspective(1200px) rotateY(0deg) rotateX(0deg) translateY(-3px); }

  @media (max-width: 860px) { transform: none; &:hover { transform: none; } }
  @media (prefers-reduced-motion: reduce) { transform: none; &:hover { transform: none; } }
`

const BrowserBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0.55rem 0.8rem;
  background: ${(p) => (p.$isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)')};

  i { width: 9px; height: 9px; border-radius: 50%; background: ${(p) => (p.$isDark ? '#3f3f46' : '#d4d4d8')}; }
  span {
    margin-left: 0.5rem;
    flex: 1;
    font-size: 0.72rem;
    padding: 0.18rem 0.6rem;
    border-radius: 6px;
    color: ${(p) => (p.$isDark ? '#a1a1aa' : '#71717a')};
    background: ${(p) => (p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)')};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const ShotImage = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 8.8;
  object-fit: cover;
  background: ${(p) => (p.$isDark ? '#12131a' : '#f1f1f5')};
  animation: shotIn 0.35s ease-out;

  @keyframes shotIn { from { opacity: 0; } to { opacity: 1; } }
`

const Thumbs = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-top: 0.45rem;
  overflow-x: auto;
  padding: 4px 2px 6px;
`

const Thumb = styled.button`
  flex: 0 0 auto;
  width: 84px;
  aspect-ratio: 16 / 10;
  padding: 0;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background: none;
  border: 2px solid ${(p) => (p.$active ? p.$accent || '#38bdf8' : 'transparent')};
  opacity: ${(p) => (p.$active ? 1 : 0.55)};
  transition: opacity 0.2s, transform 0.2s, border-color 0.2s;

  img { width: 100%; height: 100%; object-fit: cover; display: block; }
  &:hover { opacity: 1; transform: translateY(-2px); }
  &:focus-visible { outline: 2px solid ${(p) => p.$accent || '#38bdf8'}; outline-offset: 2px; }
`

/* ------------------------ Info panels (right) ------------------------ */
const Panel = styled.div`
  padding: 0.8rem 0.95rem;
  border-radius: 18px;
  background: ${(p) => (p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)')};
  border: 1px solid ${(p) => (p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)')};
  box-shadow: ${(p) => (p.$isDark ? 'inset 0 1px 0 rgba(255,255,255,0.05)' : 'inset 0 1px 0 #fff')};
`

const PanelTitle = styled.h3`
  margin: 0 0 0.7rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: ${(p) => (p.$isDark ? '#fafafa' : '#18181b')};
`

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;

  div { font-size: 0.78rem; color: ${(p) => (p.$isDark ? '#a1a1aa' : '#71717a')}; }
  strong {
    display: block;
    margin-bottom: 2px;
    font-size: 0.92rem;
    color: ${(p) => (p.$isDark ? '#fff' : '#09090b')};
  }
`

const ProjectDescription = styled.p`
  font-size: 0.88rem;
  line-height: 1.48;
  margin: 0;
  color: ${(p) => (p.$isDark ? 'rgba(255,255,255,0.84)' : 'rgba(0,0,0,0.78)')};
`

const CredHint = styled.p`
  margin: -0.2rem 0 0.45rem;
  font-size: 0.72rem;
  line-height: 1.35;
  color: ${(p) => (p.$isDark ? '#a1a1aa' : '#71717a')};
`

const CredBlock = styled.div`
  & + & { margin-top: 0.55rem; padding-top: 0.55rem; border-top: 1px dashed ${(p) => (p.$isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)')}; }
`

const CredRole = styled.div`
  font-size: 0.78rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${(p) => p.$accent || (p.$isDark ? '#38bdf8' : '#0284c7')};
`

const CredRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.5rem 0.5rem 0.8rem;
  border-radius: 10px;
  background: ${(p) => (p.$isDark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.9)')};
  border: 1px solid ${(p) => (p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')};

  & + & { margin-top: 0.45rem; }

  .label { width: 66px; flex-shrink: 0; font-size: 0.76rem; color: ${(p) => (p.$isDark ? '#a1a1aa' : '#71717a')}; }
  .value {
    flex: 1;
    min-width: 0;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.86rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const MiniButton = styled.button`
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  color: ${(p) => (p.$done ? '#10b981' : 'currentColor')};
  background: ${(p) => (p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')};
  transition: background 0.2s;

  &:hover { background: ${(p) => (p.$isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.12)')}; }
  &:focus-visible { outline: 2px solid ${(p) => p.$accent || '#38bdf8'}; outline-offset: 1px; }
`

const TextToggle = styled(MiniButton)`
  width: auto;
  padding: 0 0.6rem;
  font-size: 0.74rem;
  font-weight: 600;
`

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const TechPill = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
  background: ${(p) => (p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)')};
  border: 1px solid ${(p) => (p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)')};
  color: ${(p) => (p.$isDark ? '#e4e4e7' : '#3f3f46')};
`

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  flex: 0 0 auto;
  margin-top: 0.7rem;
  padding-top: 0.7rem;
  border-top: 1px solid ${(p) => (p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')};
`

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 999px;
  font-size: 0.93rem;
  font-weight: 700;
  text-decoration: none;
  background: ${(p) => p.$accent || (p.$isDark ? '#ffffff' : '#09090b')};
  color: ${(p) => (p.$accent ? '#ffffff' : p.$isDark ? '#09090b' : '#ffffff')};
  box-shadow: 0 4px 16px ${(p) => (p.$accent ? `${p.$accent}44` : 'rgba(0,0,0,0.2)')};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px ${(p) => (p.$accent ? `${p.$accent}66` : 'rgba(0,0,0,0.3)')}; }
  &:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
`

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.4rem;
  border-radius: 999px;
  font-size: 0.93rem;
  font-weight: 600;
  text-decoration: none;
  background: ${(p) => (p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)')};
  border: 1px solid ${(p) => (p.$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)')};
  color: currentColor;
  transition: background 0.2s, transform 0.2s;

  &:hover { background: ${(p) => (p.$isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.12)')}; transform: translateY(-2px); }
  &:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
`

const EndTunnelNotice = styled.div`
  position: absolute;
  bottom: 2.25rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.25rem;
  border-radius: 999px;
  background: ${(p) => (p.$isDark ? 'rgba(17, 17, 22, 0.9)' : 'rgba(255, 255, 255, 0.94)')};
  border: 1px solid ${(p) => (p.$isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.12)')};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => (p.$isDark ? '#93c5fd' : '#2563eb')};
  pointer-events: none;
  z-index: 25;
  white-space: nowrap;
  animation: noticeFadeIn 0.35s ease-out;

  @keyframes noticeFadeIn {
    from { opacity: 0; transform: translate(-50%, 8px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
`

/* --------------------------- Credentials --------------------------- */
function Credentials({ list, isDark, accent }) {
  const [copied, setCopied] = useState('')
  const [shown, setShown] = useState({})

  const copy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(''), 1400)
    } catch {
      /* clipboard unavailable – ignore */
    }
  }

  return (
    <Panel $isDark={isDark}>
      <PanelTitle $isDark={isDark}>Try the live demo</PanelTitle>
      <CredHint $isDark={isDark}>Use these test accounts to log in. Data is sample only.</CredHint>
      {list.map((c, i) => {
        const pw = shown[i]
        return (
          <CredBlock key={`${c.role}-${i}`} $isDark={isDark}>
            {c.role && <CredRole $isDark={isDark} $accent={accent}>{c.role}</CredRole>}
            <CredRow $isDark={isDark}>
              <span className="label">Email</span>
              <span className="value">{c.email}</span>
              <MiniButton
                $isDark={isDark}
                $accent={accent}
                $done={copied === `e${i}`}
                onClick={() => copy(`e${i}`, c.email)}
                aria-label="Copy email"
              >
                {copied === `e${i}` ? <CheckIcon /> : <CopyIcon />}
              </MiniButton>
            </CredRow>
            <CredRow $isDark={isDark}>
              <span className="label">Password</span>
              <span className="value">{pw ? c.password : '•'.repeat(Math.min(c.password.length, 10))}</span>
              <TextToggle
                $isDark={isDark}
                $accent={accent}
                onClick={() => setShown((s) => ({ ...s, [i]: !s[i] }))}
                aria-label={pw ? 'Hide password' : 'Show password'}
              >
                {pw ? 'Hide' : 'Show'}
              </TextToggle>
              <MiniButton
                $isDark={isDark}
                $accent={accent}
                $done={copied === `p${i}`}
                onClick={() => copy(`p${i}`, c.password)}
                aria-label="Copy password"
              >
                {copied === `p${i}` ? <CheckIcon /> : <CopyIcon />}
              </MiniButton>
            </CredRow>
          </CredBlock>
        )
      })}
    </Panel>
  )
}

/* ----------------------------- Overlay ----------------------------- */
export default function Overlay({
  scrollDistance,
  selected,
  onClose,
  _onExit,
  theme,
  _isExiting = false,
  _isEmbedded = false,
  effectiveMaxScroll = 58
}) {
  const isDark = theme === 'dark'
  const [isClosing, setIsClosing] = useState(false)
  const [isOpening, setIsOpening] = useState(true)
  const [activeShot, setActiveShot] = useState(0)
  const tiltRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsOpening(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const project = selected?.project

  // Screenshots: use project.screenshots when provided, otherwise placeholders
  const shots = useMemo(() => {
    if (!project) return []
    if (Array.isArray(project.screenshots) && project.screenshots.length) return project.screenshots
    return SHOT_LABELS.map((label) => makePlaceholder(label, project.accent || '#38bdf8'))
  }, [project])

  // Credentials: accept a single object, an array, or fall back to defaults
  const credentials = useMemo(() => {
    const c = project?.credentials
    if (!c) return DEFAULT_CREDENTIALS
    return Array.isArray(c) ? c : [c]
  }, [project])

  useEffect(() => setActiveShot(0), [project])

  const progress = Math.min(1, Math.max(0, scrollDistance / 4.8))
  const easeProgress = Math.pow(progress, 1.35)
  const scale = 1 + easeProgress * 0.08
  const translateY = easeProgress * -18
  const letterSpacing = -0.07 + progress * 0.06
  const textOpacity = Math.max(0, 1 - progress * 1.15)
  const bgOpacity = Math.max(0, 1 - Math.pow(progress, 1.15))
  const showIntro = (bgOpacity > 0.005 || textOpacity > 0.005) && !selected

  const handleAnimatedClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 220)
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && selected && !isClosing) handleAnimatedClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, isClosing])

  // 3D tilt that follows the pointer (desktop only, respects reduced motion)
  const canTilt = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleMove = (e) => {
    if (!tiltRef.current || !canTilt()) return
    const x = e.clientX / window.innerWidth - 0.5
    const y = e.clientY / window.innerHeight - 0.5
    tiltRef.current.style.transform = `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`
  }
  const resetTilt = () => {
    if (tiltRef.current) tiltRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)'
  }

  return (
    <>
      {showIntro && (
        <IntroScreen $isDark={isDark} $bgOpacity={bgOpacity} $translateY={translateY}>
          <IntroWrapper className={isOpening ? 'is-opening' : ''}>
            <IntroKicker $isDark={isDark}>Selected work · 03 projects</IntroKicker>
            <IntroTitle
              $isDark={isDark}
              $scale={scale}
              $textOpacity={textOpacity}
              $letterSpacing={letterSpacing}
            >
              <span className="opening-word">EXPLORE</span>{''}<br/>
              <span className="opening-word">PROJECTS</span>
            </IntroTitle>
          </IntroWrapper>
        </IntroScreen>
      )}

      {selected && typeof document !== 'undefined' && createPortal(
        <ModalBackdrop
          $isDark={isDark}
          $isClosing={isClosing}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleAnimatedClose()
          }}
          onMouseMove={handleMove}
          onMouseLeave={resetTilt}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <Scene>
            <Tilt ref={tiltRef} $isDark={isDark} $accent={project.accent}>
              <ModalCard
                $isDark={isDark}
                $isClosing={isClosing}
                role="dialog"
                aria-modal="true"
                aria-label={project.title}
                onClick={(e) => e.stopPropagation()}
              >
                <TopBar>
                  <Badges>
                    <CategoryBadge $isDark={isDark}>
                      {project.index} · {project.category}
                    </CategoryBadge>
                    <StatusDot>Production live</StatusDot>
                  </Badges>
                  <CloseButton
                    $isDark={isDark}
                    $accent={project.accent}
                    onClick={handleAnimatedClose}
                    aria-label="Close details"
                  >
                    <CloseIcon />
                  </CloseButton>
                </TopBar>

                <Header>
                  <ProjectTitle>{project.title}</ProjectTitle>
                  <ProjectSubtitle $accent={project.accent} $isDark={isDark}>
                    {project.subtitle}
                  </ProjectSubtitle>
                </Header>

                <Layout>
                  {/* Left: screenshots */}
                  <Column>
                    <BrowserFrame $isDark={isDark}>
                      <BrowserBar $isDark={isDark}>
                        <i /><i /><i />
                        <span>{(project.link || 'your-project.com').replace(/^https?:\/\//, '')}</span>
                      </BrowserBar>
                      <ShotImage
                        key={activeShot}
                        $isDark={isDark}
                        src={shots[activeShot]}
                        alt={`${project.title} screenshot ${activeShot + 1}`}
                      />
                    </BrowserFrame>

                    {shots.length > 1 && (
                      <Thumbs>
                        {shots.map((src, i) => (
                          <Thumb
                            key={i}
                            $active={i === activeShot}
                            $accent={project.accent}
                            onClick={() => setActiveShot(i)}
                            aria-label={`Show screenshot ${i + 1}`}
                          >
                            <img src={src} alt="" />
                          </Thumb>
                        ))}
                      </Thumbs>
                    )}
                  </Column>

                  {/* Right: details */}
                  <Column>
                    <Panel $isDark={isDark}>
                      <Stats $isDark={isDark}>
                        <div><strong>{project.stat || project.category}</strong>Focus</div>
                        <div><strong>{project.year || '2026'}</strong>Year</div>
                        <div><strong>Live demo</strong>Deployment</div>
                      </Stats>
                    </Panel>

                    <ProjectDescription $isDark={isDark}>{project.description}</ProjectDescription>

                    <Credentials list={credentials} isDark={isDark} accent={project.accent} />

                    <div>
                      <PanelTitle $isDark={isDark}>Built with</PanelTitle>
                      <TechList>
                        {project.tech.map((item) => (
                          <TechPill key={item} $isDark={isDark}>{item}</TechPill>
                        ))}
                      </TechList>
                    </div>
                  </Column>
                </Layout>

                <ActionRow $isDark={isDark}>
                  <PrimaryButton
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    $accent={project.accent}
                    $isDark={isDark}
                  >
                    Open live demo <ExternalIcon />
                  </PrimaryButton>
                  <SecondaryButton
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    $isDark={isDark}
                  >
                    <GithubIcon /> Source code
                  </SecondaryButton>
                </ActionRow>
              </ModalCard>
            </Tilt>
          </Scene>
        </ModalBackdrop>,
        document.body
      )}

    </>
  )
}