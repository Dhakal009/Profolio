import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { CONFIG } from './data'

export default function CameraRig({
  scrollDistance,
  scrollDistanceRef,
  selected,
  isMobile,
  isRewinding = false,
  active = true,
}) {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const smoothPos = useRef({ x: 0, y: 0 })
  const smoothRot = useRef({ x: 0, y: 0, z: 0 })
  const smoothFov = useRef(isMobile ? CONFIG.FOV_MOBILE : CONFIG.FOV_DESKTOP)
  const currentZ = useRef(CONFIG.CAMERA_Z_START)
  const targetZ = useRef(CONFIG.CAMERA_Z_START)
  const isFocused = useRef(false)

  useEffect(() => {
    targetZ.current = CONFIG.CAMERA_Z_START - scrollDistance
  }, [scrollDistance])

  useEffect(() => {
    if (!active || selected) {
      mouse.current.x = 0
      mouse.current.y = 0
      return undefined
    }

    const handlePointerMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [selected, active])

  // Camera focus animation facing the selected 3D angled hero tile dead-on
  useEffect(() => {
    const baseFov = isMobile ? CONFIG.FOV_MOBILE : CONFIG.FOV_DESKTOP

    if (selected) {
      isFocused.current = true
      const [tx, ty, tz] = selected.position
      const ry = selected.rotation?.[1] ?? 0
      const dist = 3.25

      const camX = tx + Math.sin(ry) * dist
      const camY = ty
      const camZ = tz + Math.cos(ry) * dist

      const tl = gsap.timeline({
        defaults: { duration: CONFIG.FOCUS_DURATION, ease: 'power3.inOut' },
      })

      tl.to(camera.position, { x: camX, y: camY, z: camZ }, 0)
      tl.to(camera.rotation, { x: 0, y: ry, z: 0 }, 0)
      tl.to(
        camera,
        {
          fov: baseFov,
          onUpdate: () => camera.updateProjectionMatrix(),
        },
        0
      )

      return () => tl.kill()
    } else if (isFocused.current) {
      const tl = gsap.timeline({
        defaults: { duration: CONFIG.FOCUS_DURATION * 0.8, ease: 'power3.out' },
        onComplete: () => {
          isFocused.current = false
        },
      })

      tl.to(camera.position, { x: smoothPos.current.x, y: smoothPos.current.y, z: currentZ.current }, 0)
      tl.to(camera.rotation, { x: 0, y: 0, z: 0 }, 0)

      return () => tl.kill()
    }
  }, [selected, camera, isMobile])

  // Cinematic 3D camera flight: S-curve weave, hero-tile look-bias, velocity FOV warp & pointer orbit
  useFrame(({ clock }, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05)

    if (scrollDistanceRef) {
      targetZ.current = CONFIG.CAMERA_Z_START - scrollDistanceRef.current
    }

    if (!selected && !isFocused.current) {
      const posK = 1 - Math.exp(-dt * 7.2)
      const rotK = 1 - Math.exp(-dt * 5.2)
      const fovK = 1 - Math.exp(-dt * 6.0)

      const prevZ = currentZ.current
      if (isRewinding) {
        currentZ.current = targetZ.current
      } else {
        currentZ.current += (targetZ.current - currentZ.current) * posK
      }

      // Keep flight centered on the hero cards while retaining rich 3D pointer orbit & banking
      const depthTraveled = Math.max(0, CONFIG.CAMERA_Z_START - currentZ.current)
      const t = clock.getElapsedTime()

      const idleX = Math.sin(t * 0.55) * 0.04
      const idleY = Math.cos(t * 0.45) * 0.03
      const curveY = Math.sin(depthTraveled * 0.22) * 0.1

      const pointerScale = isMobile ? 0.3 : 1
      const targetX = mouse.current.x * 0.5 * pointerScale + idleX
      const targetY = curveY - mouse.current.y * 0.32 * pointerScale + idleY

      smoothPos.current.x += (targetX - smoothPos.current.x) * rotK
      smoothPos.current.y += (targetY - smoothPos.current.y) * rotK

      const velZ = (prevZ - currentZ.current) / Math.max(dt, 0.008)
      const maxYaw = (isMobile ? 1.8 : 4.8) * (Math.PI / 180)
      const maxPitch = (isMobile ? 1.4 : 3.4) * (Math.PI / 180)
      const maxRoll = (isMobile ? 0.6 : 2.1) * (Math.PI / 180)

      const targetYaw = -mouse.current.x * maxYaw
      const targetPitch = mouse.current.y * maxPitch - Math.sin(depthTraveled * 0.22) * 0.012
      const targetRoll = -mouse.current.x * maxRoll

      smoothRot.current.x += (targetPitch - smoothRot.current.x) * rotK
      smoothRot.current.y += (targetYaw - smoothRot.current.y) * rotK
      smoothRot.current.z += (targetRoll - smoothRot.current.z) * rotK

      camera.position.x = smoothPos.current.x
      camera.position.y = smoothPos.current.y
      camera.position.z = currentZ.current

      camera.rotation.x = smoothRot.current.x
      camera.rotation.y = smoothRot.current.y
      camera.rotation.z = smoothRot.current.z

      // Dynamic velocity FOV warp for true 3D forward-speed immersion
      const baseFov = isMobile ? CONFIG.FOV_MOBILE : CONFIG.FOV_DESKTOP
      const speedBoost = Math.min(7.5, Math.abs(velZ) * 0.32)
      const targetFov = baseFov + speedBoost
      smoothFov.current += (targetFov - smoothFov.current) * fovK
      if (Math.abs(camera.fov - smoothFov.current) > 0.02) {
        camera.fov = smoothFov.current
        camera.updateProjectionMatrix()
      }
    }
  })

  return null
}
