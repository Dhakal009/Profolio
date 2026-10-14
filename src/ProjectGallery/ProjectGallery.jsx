import { useState, useEffect, useRef, Suspense, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import styled from 'styled-components'
import gsap from 'gsap'
import { useTheme } from '../contexts/ThemeContext'
import { PROJECTS, CONFIG } from './data'
import Tunnel from './Tunnel'
import CameraRig from './CameraRig'
import Overlay from './Overlay'

const FullscreenContainer = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 85;
  background: ${(props) => (props.$isDark ? '#08080a' : '#f4f4f6')};
  user-select: none;
`

export default function ProjectGallery() {
  const { id } = useParams()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [selected, setSelected] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [scrollDistance, setScrollDistance] = useState(0)
  const [isRewinding, setIsRewinding] = useState(false)

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

  // Manage body classes for full-screen disturbance-free view and dock hiding
  useEffect(() => {
    document.body.classList.add('tunnel-active')
    return () => {
      document.body.classList.remove('tunnel-active', 'tunnel-scrolling', 'in-tunnel')
    }
  }, [])

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
        if (!isRewindingRef.current) {
          currentScrollRef.current +=
            (targetScrollRef.current - currentScrollRef.current) * CONFIG.LERP_FACTOR

          // Clamp at entrance
          if (currentScrollRef.current < 0.05) currentScrollRef.current = 0

          setScrollDistance(currentScrollRef.current)
        }

        // Show back button and hide bottom dock ONLY when scrolling inside the tunnel or when modal is open
        if (currentScrollRef.current > 0.4 || selected) {
          document.body.classList.add('tunnel-scrolling', 'in-tunnel')
        } else {
          document.body.classList.remove('tunnel-scrolling', 'in-tunnel')
        }
      }
      animFrameRef.current = requestAnimationFrame(loop)
    }

    animFrameRef.current = requestAnimationFrame(loop)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [selected])

  // Smooth exit: gradually rewinds camera and brings text back into view with zero sudden jumps
  const handleExit = useCallback(() => {
    if (selected) {
      setSelected(null)
      window.history.replaceState(null, '', '/projects')
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
  }, [selected])

  // Listen to exit-tunnel custom event from navbar back button
  useEffect(() => {
    const onExitTunnel = () => handleExit()
    window.addEventListener('exit-tunnel', onExitTunnel)
    return () => window.removeEventListener('exit-tunnel', onExitTunnel)
  }, [handleExit])

  // Wheel listener: smooth 1:1 forward and backward scroll (stops cleanly at 0 without unintended navigation)
  const handleWheel = useCallback(
    (e) => {
      if (selected || isRewindingRef.current) return

      // Exact same 1:1 speed forward and backward, securely clamped at 0
      targetScrollRef.current = Math.max(
        0,
        targetScrollRef.current + e.deltaY * CONFIG.SCROLL_SPEED_FORWARD
      )
    },
    [selected]
  )

  // Touch handlers for mobile
  const handleTouchStart = useCallback(
    (e) => {
      if (selected || isRewindingRef.current) return
      touchStartY.current = e.touches[0].clientY
    },
    [selected]
  )

  const handleTouchMove = useCallback(
    (e) => {
      if (selected || isRewindingRef.current) return
      const deltaY = touchStartY.current - e.touches[0].clientY
      touchStartY.current = e.touches[0].clientY

      // Exact same 1:1 speed forward and backward, securely clamped at 0
      targetScrollRef.current = Math.max(
        0,
        targetScrollRef.current + deltaY * CONFIG.SCROLL_SPEED_FORWARD * 1.3
      )
    },
    [selected]
  )

  const handleSelect = useCallback((project, position, rotation) => {
    setSelected({ project, position, rotation })
    window.history.replaceState(null, '', `/projects/${project.id}`)
  }, [])

  const handleClose = useCallback(() => {
    setSelected(null)
    window.history.replaceState(null, '', `/projects`)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selected) {
        if (e.key === 'Escape') handleClose()
      } else {
        if (e.key === 'Escape') {
          handleExit()
        } else if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
          targetScrollRef.current += 3.5
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          targetScrollRef.current = Math.max(0, targetScrollRef.current - 3.5)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selected, handleClose, handleExit])

  return (
    <FullscreenContainer
      $isDark={isDark}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
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
      />
    </FullscreenContainer>
  )
}