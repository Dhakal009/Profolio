import { useState, useEffect } from 'react'
import styled from 'styled-components'

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


// Dynamic entrance & exit overlay with cinematic 3D expansion animation
const IntroScreen = styled.div.attrs((props) => ({
  style: {
    opacity: props.$bgOpacity,
    backdropFilter: `blur(${props.$blur}px)`,
    WebkitBackdropFilter: `blur(${props.$blur}px)`,
    background: props.$isDark
      ? `rgba(8, 8, 10, ${0.92 * props.$bgOpacity})`
      : `rgba(244, 244, 247, ${0.92 * props.$bgOpacity})`,
    pointerEvents: props.$progress < 0.75 ? 'auto' : 'none'
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
  perspective: 1200px;
  will-change: opacity, backdrop-filter;
  transition: opacity 0.12s ease-out;
`

const IntroTitle = styled.h1.attrs((props) => ({
  style: {
    transform: `translate3d(0, 0, ${props.$translateZ}px) scale(${props.$scale})`,
    opacity: props.$textOpacity,
    letterSpacing: `${props.$letterSpacing}em`
  }
}))`
  font-size: clamp(2.5rem, 6.5vw, 5.5rem);
  font-weight: 900;
  line-height: 1.05;
  margin: 0;
  color: ${(props) => (props.$isDark ? '#ffffff' : '#09090b')};
  max-width: 950px;
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
  gap: 1.4rem;
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
    0% {
      opacity: 0;
      transform: translateY(28px) scale(0.92);
      filter: blur(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0px);
    }
  }
`

const ModalBackdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);
  background: ${(props) =>
    props.$isDark ? 'rgba(4, 4, 6, 0.75)' : 'rgba(235, 235, 240, 0.75)'};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: opacity 0.22s ease-in;
  opacity: ${(props) => (props.$isClosing ? 0 : 1)};
  animation: fadeIn 0.25s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`

const ModalCard = styled.div`
  position: relative;
  width: min(92vw, 760px);
  max-height: 88vh;
  overflow-y: auto;
  border-radius: 28px;
  padding: clamp(1.75rem, 4vw, 2.75rem);
  background: ${(props) =>
    props.$isDark
      ? 'rgba(17, 17, 22, 0.94)'
      : 'rgba(255, 255, 255, 0.96)'};
  border: 1px solid ${(props) => (props.$accent ? props.$accent : props.$isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)')};
  box-shadow: ${(props) =>
    props.$isDark
      ? '0 24px 70px rgba(0, 0, 0, 0.85), 0 0 35px rgba(0, 0, 0, 0.5)'
      : '0 24px 60px rgba(0, 0, 0, 0.12)'};
  color: ${(props) => (props.$isDark ? '#ffffff' : '#09090b')};
  transition: transform 0.22s ease-in, opacity 0.2s ease-in;
  transform: ${(props) => (props.$isClosing ? 'scale(0.95) translateY(20px)' : 'scale(1) translateY(0)')};
  opacity: ${(props) => (props.$isClosing ? 0 : 1)};
  animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes popIn {
    from { transform: scale(0.95) translateY(12px); opacity: 0; }
    to { transform: scale(1) translateY(0); opacity: 1; }
  }
`

const ModalTopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
`

const BadgeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`

const CategoryBadge = styled.span`
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.32rem 0.85rem;
  border-radius: 999px;
  background: ${(props) => (props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)')};
  color: ${(props) => (props.$isDark ? '#e4e4e7' : '#3f3f46')};
`

const StatusDot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #10b981;
  padding: 0.32rem 0.75rem;
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
  border: 1px solid ${(props) => (props.$isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)')};
  background: ${(props) => (props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)')};
  color: currentColor;
  display: grid;
  place-items: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)')};
    transform: scale(1.06);
  }
`

const ProjectTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  margin: 0 0 0.5rem 0;
  line-height: 1.1;
`

const ProjectSubtitle = styled.p`
  font-size: 1.15rem;
  font-weight: 600;
  color: ${(props) => (props.$accent ? props.$accent : props.$isDark ? '#38bdf8' : '#0284c7')};
  margin: 0 0 1.5rem 0;
`

const KeyFeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1.1rem;
  border-radius: 16px;
  background: ${(props) => (props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)')};
  border: 1px solid ${(props) => (props.$isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)')};

  .stat-item {
    font-size: 0.85rem;
    color: ${(props) => (props.$isDark ? '#a1a1aa' : '#71717a')};

    strong {
      display: block;
      font-size: 0.98rem;
      font-weight: 700;
      color: ${(props) => (props.$isDark ? '#ffffff' : '#09090b')};
      margin-bottom: 3px;
    }
  }
`

const ProjectDescription = styled.p`
  font-size: 1.05rem;
  line-height: 1.7;
  color: ${(props) => (props.$isDark ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 0, 0, 0.8)')};
  margin: 0 0 1.75rem 0;
`

const TechSection = styled.div`
  margin-bottom: 2rem;

  .section-label {
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: ${(props) => (props.$isDark ? '#71717a' : '#a1a1aa')};
    margin-bottom: 0.6rem;
  }
`

const TechList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
`

const TechPill = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.4rem 0.95rem;
  border-radius: 8px;
  background: ${(props) => (props.$isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)')};
  border: 1px solid ${(props) => (props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)')};
  color: ${(props) => (props.$isDark ? '#e4e4e7' : '#3f3f46')};
`

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1.5rem;
  border-top: 1px solid ${(props) => (props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)')};
`

const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.6rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  background: ${(props) => (props.$accent ? props.$accent : props.$isDark ? '#ffffff' : '#09090b')};
  color: ${(props) => (props.$accent ? '#ffffff' : props.$isDark ? '#09090b' : '#ffffff')};
  box-shadow: 0 4px 16px ${(props) => (props.$accent ? `${props.$accent}44` : 'rgba(0,0,0,0.2)')};
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 22px ${(props) => (props.$accent ? `${props.$accent}66` : 'rgba(0,0,0,0.3)')};
  }
`

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.45rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  background: ${(props) => (props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)')};
  border: 1px solid ${(props) => (props.$isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)')};
  color: currentColor;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.12)')};
    transform: translateY(-2px);
  }
`

export default function Overlay({
  scrollDistance,
  selected,
  onClose,
  onExit,
  theme,
  isExiting = false
}) {
  const isDark = theme === 'dark'
  const [isClosing, setIsClosing] = useState(false)
  const [isOpening, setIsOpening] = useState(true)

  // Trigger opening animation when entering project section
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpening(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Dynamic scale and fly-out animation with high-end cubic easing:
  // Using 4.8 threshold provides a deep, gradual zoom-in & zoom-out transition
  // When scrolling forward (0 -> 4.8): scale expands smoothly from 1.0 to ~13x in 3D perspective
  // When scrolling backward / clicking back button: text gradually reappears from outer view and scales down
  // to rest at its crisp original size in the center of the viewport
  const progress = Math.min(1, Math.max(0, scrollDistance / 4.8))
  const easeProgress = Math.pow(progress, 1.35)
  const scale = 1 + easeProgress * 12.0
  const translateZ = easeProgress * 380
  const letterSpacing = -0.035 + progress * 0.35
  const textOpacity = progress < 0.6 ? 1 : Math.max(0, 1 - (progress - 0.6) / 0.4)
  const bgOpacity = Math.max(0, 1 - Math.pow(progress, 1.15))
  const blurAmount = Math.max(0, (1 - Math.pow(progress, 1.15)) * 18)
  const showIntro = (bgOpacity > 0.005 || textOpacity > 0.005) && !selected

  const handleAnimatedClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 220)
  }

  // Handle escape key with smooth exit animation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && selected && !isClosing) {
        handleAnimatedClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, isClosing])

  return (
    <>
      {/* 1. Dynamic scaling text: opening entrance animation on page load, zooms out as tunnel opens, gradually returns to original size as tunnel closes */}
      {showIntro && (
        <IntroScreen
          $isDark={isDark}
          $bgOpacity={bgOpacity}
          $blur={blurAmount}
          $progress={progress}
        >
          <IntroWrapper className={isOpening ? 'is-opening' : ''}>
            <IntroTitle
              $isDark={isDark}
              $scale={scale}
              $translateZ={translateZ}
              $textOpacity={textOpacity}
              $letterSpacing={letterSpacing}
            >
              <span className="opening-word">SCROLL</span>{' '}
              <span className="opening-word">TO</span>{' '}
              <span className="opening-word">VIEW</span>{' '}
              <span className="opening-word">PROJECTS</span>
            </IntroTitle>
          </IntroWrapper>
        </IntroScreen>
      )}

      {/* 2. Redesigned Project Details Modal with smooth exit animation */}
      {selected && (
        <ModalBackdrop
          $isDark={isDark}
          $isClosing={isClosing}
          onClick={handleAnimatedClose}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <ModalCard
            $isDark={isDark}
            $accent={selected.project.accent}
            $isClosing={isClosing}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalTopBar>
              <BadgeGroup>
                <CategoryBadge $isDark={isDark}>
                  {selected.project.index} · {selected.project.category}
                </CategoryBadge>
                <StatusDot>Production Live</StatusDot>
              </BadgeGroup>

              <CloseButton
                $isDark={isDark}
                onClick={handleAnimatedClose}
                aria-label="Close details"
              >
                <CloseIcon />
              </CloseButton>
            </ModalTopBar>

            <ProjectTitle>{selected.project.title}</ProjectTitle>
            <ProjectSubtitle $accent={selected.project.accent} $isDark={isDark}>
              {selected.project.subtitle}
            </ProjectSubtitle>

            <KeyFeaturesGrid $isDark={isDark}>
              <div className="stat-item">
                <strong>Core Focus</strong>
                <span>{selected.project.stat || selected.project.category}</span>
              </div>
              <div className="stat-item">
                <strong>Year</strong>
                <span>{selected.project.year || '2026'}</span>
              </div>
              <div className="stat-item">
                <strong>Deployment</strong>
                <span>Interactive Live Demo</span>
              </div>
            </KeyFeaturesGrid>

            <ProjectDescription $isDark={isDark}>
              {selected.project.description}
            </ProjectDescription>

            <TechSection $isDark={isDark}>
              <div className="section-label">Architecture & Technologies</div>
              <TechList>
                {selected.project.tech.map((item) => (
                  <TechPill key={item} $isDark={isDark}>
                    {item}
                  </TechPill>
                ))}
              </TechList>
            </TechSection>

            <ActionRow $isDark={isDark}>
              <PrimaryButton
                href={selected.project.link}
                $accent={selected.project.accent}
                $isDark={isDark}
              >
                Live Demo <ExternalIcon />
              </PrimaryButton>

              <SecondaryButton
                href={selected.project.github}
                target="_blank"
                rel="noopener noreferrer"
                $isDark={isDark}
              >
                <GithubIcon /> Source Code
              </SecondaryButton>
            </ActionRow>
          </ModalCard>
        </ModalBackdrop>
      )}
    </>
  )
}