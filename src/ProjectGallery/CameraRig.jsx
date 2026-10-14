import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { CONFIG } from './data'

export default function CameraRig({
  scrollDistance,
  selected,
  isMobile,
  isRewinding = false
}) {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const quickYaw = useRef(null)
  const quickPitch = useRef(null)
  const currentZ = useRef(CONFIG.CAMERA_Z_START)
  const targetZ = useRef(CONFIG.CAMERA_Z_START)
  const isFocused = useRef(false)

  // Track target Z from scrollDistance
  useEffect(() => {
    targetZ.current = CONFIG.CAMERA_Z_START - scrollDistance
  }, [scrollDistance])

  // Mouse parallax setup
  useEffect(() => {
    quickYaw.current = gsap.quickTo(camera.rotation, 'y', { duration: 0.5, ease: 'power3.out' })
    quickPitch.current = gsap.quickTo(camera.rotation, 'x', { duration: 0.5, ease: 'power3.out' })

    const handlePointerMove = (e) => {
      if (selected) return
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      mouse.current.x = x
      mouse.current.y = y

      const maxYaw = isMobile ? CONFIG.PARALLAX_X * 0.35 : CONFIG.PARALLAX_X
      const maxPitch = isMobile ? CONFIG.PARALLAX_Y * 0.35 : CONFIG.PARALLAX_Y

      quickYaw.current?.(x * maxYaw * (Math.PI / 180))
      quickPitch.current?.(-y * maxPitch * (Math.PI / 180))
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [camera, selected, isMobile])

  // Camera focus animation facing the tile
  useEffect(() => {
    if (selected) {
      isFocused.current = true
      const [tx, ty, tz] = selected.position

      let camX = 0
      let camY = 0
      let camZ = tz
      let rotX = 0
      let rotY = 0

      if (tx < -2) {
        // Tile is on left wall -> camera placed to the right, looking left (+pi/2)
        camX = tx + 2.5
        camY = ty
        rotY = Math.PI / 2
      } else if (tx > 2) {
        // Tile is on right wall -> camera placed to the left, looking right (-pi/2)
        camX = tx - 2.5
        camY = ty
        rotY = -Math.PI / 2
      } else if (ty < -1.5) {
        // Tile is on floor -> camera placed above, looking down (-pi/2)
        camX = tx
        camY = ty + 2.4
        rotX = -Math.PI / 2
      } else {
        // Ceiling
        camX = tx
        camY = ty - 2.4
        rotX = Math.PI / 2
      }

      const tl = gsap.timeline({
        defaults: { duration: CONFIG.FOCUS_DURATION, ease: 'power3.inOut' }
      })

      tl.to(camera.position, {
        x: camX,
        y: camY,
        z: camZ
      }, 0)

      tl.to(camera.rotation, {
        x: rotX,
        y: rotY,
        z: 0
      }, 0)

      return () => tl.kill()
    } else if (isFocused.current) {
      // Return smoothly to center line of flight
      const tl = gsap.timeline({
        defaults: { duration: CONFIG.FOCUS_DURATION * 0.8, ease: 'power3.out' },
        onComplete: () => {
          isFocused.current = false
        }
      })

      tl.to(camera.position, {
        x: 0,
        y: 0,
        z: currentZ.current
      }, 0)

      tl.to(camera.rotation, {
        x: 0,
        y: 0,
        z: 0
      }, 0)

      return () => tl.kill()
    }
  }, [selected, camera])

  // Roaming motion in useFrame
  useFrame(() => {
    if (!selected && !isFocused.current) {
      if (isRewinding) {
        // Direct synchronization with GSAP rewind curve for zero-lag gradual exit
        currentZ.current = targetZ.current
        camera.position.z = currentZ.current
        camera.position.x += (0 - camera.position.x) * 0.15
        camera.position.y += (0 - camera.position.y) * 0.15
      } else {
        currentZ.current += (targetZ.current - currentZ.current) * CONFIG.LERP_FACTOR
        camera.position.z = currentZ.current
        camera.position.x += (0 - camera.position.x) * 0.1
        camera.position.y += (0 - camera.position.y) * 0.1
      }
    }
  })

  return null
}
