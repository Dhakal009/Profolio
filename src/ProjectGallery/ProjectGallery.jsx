import { useState, useEffect, useRef, Suspense, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import styled from 'styled-components'
import gsap from 'gsap'
import { useTheme } from '../contexts/ThemeContext'
import { useOptionalLenis } from '../contexts/LenisContext'
import { PROJECTS, CONFIG } from './data'
import Tunnel from './Tunnel'
import CameraRig from './CameraRig'
import Overlay from './Overlay'

export const INTRO_HOLD_VH = 25

const GalleryContainer = styled.div`
  position: ${(props) => (props.$isEmbedded ? 'relative' : 'fixed')};
  ${(props) => (props.$isEmbedded ? 'width: 100%; height: 100%;' : 'inset: 0; width: 100vw; height: 100vh; z-index: 85;')}
  overflow: hidden;
  background: ${(props) => (props.$isDark ? '#08080a' : '#f4f4f6')};
  user-select: none;
`

export default function ProjectGallery({ isEmbedded = false, containerRef = null }) {
  const { id } = useParams()
  const { theme } = useTheme()
  const { lenis } = useOptionalLenis() || {}
  const isDark = theme === 'dark'

  const [selected, setSelected] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [scrollDistance, setScrollDistance] = useState(0)
  const [isRewinding, setIsRewinding] = useState(false)

  // REDUCED TUNNEL LENGTH - 30% shorter, must match Tunnel.jsx
  const EFFECTIVE_ROWS = Math.floor(CONFIG.ROWS * 0.7)
  const EFFECTIVE_MAX_SCROLL = (EFFECTIVE_ROWS - 1) * CONFIG.ROW_SPACING - 2

  const targetScrollRef = useRef(0)
  const currentScrollRef = useRef(0)
  const touchStartY = useRef(0)
  const animFrameRef = useRef(null)
  const isRewindingRef = useRef(false)

  // Mobile detection
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const m = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(m.matches)
    update()
    m.addEventListener('change', update)
    return () => m.removeEventListener('change', update)
  }, [])

  // Manage body classes for standalone view
  useEffect(() => {
    if (isEmbedded) return
    document.body.classList.add('tunnel-active')
    return () => {
      document.body.classList.remove('tunnel-active', 'tunnel-scrolling', 'in-tunnel')
    }
  }, [isEmbedded])

  // Freeze Lenis and page scroll when a project modal is open
  useEffect(() => {
    if (!isEmbedded) return
    if (selected) {
      if (lenis) lenis.stop()
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
        if (lenis) lenis.start()
      }
    }
  }, [isEmbedded, selected, lenis])

  // Deep-link matching from URL parameter
  useEffect(() => {
    if (id) {
      const matchIndex = PROJECTS.findIndex((p) => p.id === id)
      if (matchIndex !== -1) {
        const match = PROJECTS[matchIndex]
        const r = [1, 3, 5][matchIndex % 3]
        setSelected({
          project: match,
          position: [-CONFIG.TUNNEL_W / 2, 0, -r * CONFIG.ROW_SPACING],
          rotation: [0, Math.PI / 2, 0]
        })
      }
    }
  }, [id])

  // Virtual smooth scroll loop
  useEffect(() => {
    const loop = () => {
      if (!selected) {
        if (isEmbedded) {
          const el = containerRef?.current || document.getElementById('projects')
          if (el) {
            const rect = el.getBoundingClientRect()
            const vh = window.innerHeight
            const hold = (INTRO_HOLD_VH / 100) * vh
            const totalDist = el.offsetHeight - vh - hold
            if (totalDist > 0) {
              const p = Math.max(0, Math.min(1, (-rect.top - hold) / totalDist))
              targetScrollRef.current = p * EFFECTIVE_MAX_SCROLL
            }
          }
        }

        if (!isRewindingRef.current) {
          currentScrollRef.current +=
            (targetScrollRef.current - currentScrollRef.current) * (isEmbedded ? 0.1 : CONFIG.LERP_FACTOR)

          // Clamp at entrance and end
          if (currentScrollRef.current < 0.05) currentScrollRef.current = 0
          if (currentScrollRef.current > EFFECTIVE_MAX_SCROLL - 0.05) {
            currentScrollRef.current = EFFECTIVE_MAX_SCROLL
          }

          setScrollDistance(currentScrollRef.current)
        }

        if (!isEmbedded) {
          if (currentScrollRef.current > 0.4 || selected) {
            document.body.classList.add('tunnel-scrolling', 'in-tunnel')
          } else {
            document.body.classList.remove('tunnel-scrolling', 'in-tunnel')
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [selected, isEmbedded, containerRef, EFFECTIVE_MAX_SCROLL])

  // Smooth exit: gradually rewinds camera
  const handleExit = useCallback(() => {
    if (selected) {
      setSelected(null)
      if (!isEmbedded) {
        window.history.replaceState(null, '', '/projects')
      }
    }
    const startScroll = currentScrollRef.current
    if (startScroll > 0.02 || targetScrollRef.current > 0.02) {
      isRewindingRef.current = true
      setIsRewinding(true)

      const duration = Math.min(1.4, Math.max(1.0, startScroll * 0.045))
      const tweenObj = { val: startScroll }

      gsap.to(tweenObj, {
        val: 0,
        duration,
        ease: 'power3.inOut',
        onUpdate: () => {
          currentScrollRef.current = tweenObj.val
          targetScrollRef.current = tweenObj.val
          setScrollDistance(tweenObj.val)
        },
        onComplete: () => {
          targetScrollRef.current = 0
          currentScrollRef.current = 0
          setScrollDistance(0)
          isRewindingRef.current = false
          setIsRewinding(false)
        }
      })
    }
  }, [selected, isEmbedded])

  // Listen to exit-tunnel custom event
  useEffect(() => {
    const onExitTunnel = () => handleExit()
    window.addEventListener('exit-tunnel', onExitTunnel)
    return () => window.removeEventListener('exit-tunnel', onExitTunnel)
  }, [handleExit])

  // Wheel listener: smooth forward and backward scroll (used when !isEmbedded)
  const handleWheel = useCallback(
    (e) => {
      if (isEmbedded || selected || isRewindingRef.current) return

      targetScrollRef.current = Math.min(
        EFFECTIVE_MAX_SCROLL,
        Math.max(0, targetScrollRef.current + e.deltaY * CONFIG.SCROLL_SPEED_FORWARD)
      )
    },
    [selected, isEmbedded, EFFECTIVE_MAX_SCROLL]
  )

  // Touch handlers for mobile (used when !isEmbedded)
  const handleTouchStart = useCallback(
    (e) => {
      if (isEmbedded || selected || isRewindingRef.current) return
      touchStartY.current = e.touches[0].clientY
    },
    [selected, isEmbedded]
  )

  const handleTouchMove = useCallback(
    (e) => {
      if (isEmbedded || selected || isRewindingRef.current) return
      const deltaY = touchStartY.current - e.touches[0].clientY
      touchStartY.current = e.touches[0].clientY

      targetScrollRef.current = Math.min(
        EFFECTIVE_MAX_SCROLL,
        Math.max(0, targetScrollRef.current + deltaY * CONFIG.SCROLL_SPEED_FORWARD * 1.3)
      )
    },
    [selected, isEmbedded, EFFECTIVE_MAX_SCROLL]
  )

  const handleSelect = useCallback(
    (project, position, rotation) => {
      setSelected({ project, position, rotation })
      if (!isEmbedded) {
        window.history.replaceState(null, '', `/projects/${project.id}`)
      }
    },
    [isEmbedded]
  )

  const handleClose = useCallback(() => {
    setSelected(null)
    if (!isEmbedded) {
      window.history.replaceState(null, '', `/projects`)
    }
  }, [isEmbedded])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selected) {
        if (e.key === 'Escape') handleClose()
      } else if (!isEmbedded) {
        if (e.key === 'Escape') {
          handleExit()
        } else if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
          targetScrollRef.current = Math.min(EFFECTIVE_MAX_SCROLL, targetScrollRef.current + 3.5)
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          targetScrollRef.current = Math.max(0, targetScrollRef.current - 3.5)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selected, isEmbedded, handleClose, handleExit, EFFECTIVE_MAX_SCROLL])

  return (
    <GalleryContainer
      $isDark={isDark}
      $isEmbedded={isEmbedded}
      onWheel={isEmbedded ? undefined : handleWheel}
      onTouchStart={isEmbedded ? undefined : handleTouchStart}
      onTouchMove={isEmbedded ? undefined : handleTouchMove}
    >
      <Canvas
        dpr={[1, isMobile ? 1.5 : 1.75]}
        frameloop="always"
        camera={{
          position: [0, 0, CONFIG.CAMERA_Z_START],
          fov: isMobile ? CONFIG.FOV_MOBILE : CONFIG.FOV_DESKTOP,
          near: 0.1,
          far: 90
        }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false, stencil: false }}
        style={{
          width: '100%',
          height: '100%',
          background: isDark ? '#08080a' : '#f4f4f6'
        }}
      >
        <color attach="background" args={[isDark ? '#08080a' : '#f4f4f6']} />
        <fog
          attach="fog"
          args={[isDark ? '#08080a' : '#f4f4f6', 16, 62]}
        />

        <ambientLight intensity={isDark ? 0.95 : 1.45} />
        <directionalLight
          position={[6, 9, 6]}
          intensity={isDark ? 1.3 : 1.6}
        />

        <Suspense fallback={null}>
          <Tunnel
            projects={PROJECTS}
            onSelect={handleSelect}
            hoveredId={hoveredId}
            setHoveredId={setHoveredId}
            selectedId={selected?.project.id ?? null}
            isMobile={isMobile}
            isDark={isDark}
          />
          <CameraRig
            scrollDistance={scrollDistance}
            selected={selected}
            isMobile={isMobile}
            isRewinding={isRewinding}
          />
          <Preload all />
        </Suspense>
      </Canvas>

       <Overlay
        scrollDistance={scrollDistance}
        selected={selected}
        onClose={handleClose}
        onExit={handleExit}
        theme={theme}
        isExiting={isRewinding}
        isEmbedded={isEmbedded}
        effectiveMaxScroll={EFFECTIVE_MAX_SCROLL}
      />
 
    </GalleryContainer>
  )
}