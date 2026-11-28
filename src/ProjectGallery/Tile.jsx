import { memo, useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

const textureCache = new Map()
const HERO_DEPTH = 0.22

const sharedGeos = {
  emptyPlane: null,
  emptyBorder: null,
  heroBox: null,
  heroPlane: null,
  cross: null,
}

let sharedSoftGlowTex = null
let sharedSheenTex = null

function getSoftGlowTexture() {
  if (sharedSoftGlowTex || typeof document === 'undefined') return sharedSoftGlowTex
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,0.9)')
  g.addColorStop(0.45, 'rgba(255,255,255,0.35)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  sharedSoftGlowTex = new THREE.CanvasTexture(c)
  sharedSoftGlowTex.needsUpdate = true
  return sharedSoftGlowTex
}

function getSheenTexture() {
  if (sharedSheenTex || typeof document === 'undefined') return sharedSheenTex
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 256, 256)
  g.addColorStop(0, 'rgba(255,255,255,0.22)')
  g.addColorStop(0.32, 'rgba(255,255,255,0.04)')
  g.addColorStop(0.55, 'rgba(255,255,255,0)')
  g.addColorStop(1, 'rgba(255,255,255,0.08)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  sharedSheenTex = new THREE.CanvasTexture(c)
  sharedSheenTex.needsUpdate = true
  return sharedSheenTex
}

function getSharedGeometries(config) {
  if (!sharedGeos.emptyPlane) {
    sharedGeos.emptyPlane = new THREE.PlaneGeometry(config.TILE_W, config.TILE_H)
    sharedGeos.emptyBorder = new THREE.EdgesGeometry(sharedGeos.emptyPlane)
    sharedGeos.heroBox = new THREE.BoxGeometry(config.HERO_TILE_W, config.HERO_TILE_H, HERO_DEPTH)
    sharedGeos.heroPlane = new THREE.PlaneGeometry(config.HERO_TILE_W, config.HERO_TILE_H)

    const points = [
      new THREE.Vector3(-0.1, 0, 0.01),
      new THREE.Vector3(0.1, 0, 0.01),
      new THREE.Vector3(0, -0.1, 0.01),
      new THREE.Vector3(0, 0.1, 0.01),
    ]
    sharedGeos.cross = new THREE.BufferGeometry().setFromPoints(points)
  }
  return sharedGeos
}

const emptyMats = {
  dark: null,
  light: null,
}

function getEmptyMaterials(isDark) {
  const key = isDark ? 'dark' : 'light'
  if (!emptyMats[key]) {
    emptyMats[key] = isDark
      ? {
          meshMat: new THREE.MeshBasicMaterial({
            color: '#121319',
            transparent: true,
            opacity: 0.22,
            side: THREE.DoubleSide,
          }),
          borderMat: new THREE.LineBasicMaterial({
            color: '#262836',
            transparent: true,
            opacity: 0.24,
          }),
          crossMat: new THREE.LineBasicMaterial({
            color: '#2c2e3f',
            transparent: true,
            opacity: 0.22,
          }),
        }
      : {
          meshMat: new THREE.MeshBasicMaterial({
            color: '#eef2f6',
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
          }),
          borderMat: new THREE.LineBasicMaterial({
            color: '#d4dbe4',
            transparent: true,
            opacity: 0.72,
          }),
          crossMat: new THREE.LineBasicMaterial({
            color: '#cbd5e1',
            transparent: true,
            opacity: 0.4,
          }),
        }
  }
  return emptyMats[key]
}

const BOLD_PALETTES = {
  ems: {
    start: '#10b981',
    end: '#047857',
    ink: '#041a13',
    muted: 'rgba(4, 26, 19, 0.68)',
    line: 'rgba(4, 26, 19, 0.2)',
    watermark: 'rgba(4, 26, 19, 0.08)',
    rim: '#059669',
  },
  'live-chat': {
    start: '#6366f1',
    end: '#3730a3',
    ink: '#ffffff',
    muted: 'rgba(255, 255, 255, 0.76)',
    line: 'rgba(255, 255, 255, 0.24)',
    watermark: 'rgba(255, 255, 255, 0.09)',
    rim: '#4f46e5',
  },
  'ecommerce-app': {
    start: '#fbbf24',
    end: '#d97706',
    ink: '#181002',
    muted: 'rgba(24, 16, 2, 0.68)',
    line: 'rgba(24, 16, 2, 0.2)',
    watermark: 'rgba(24, 16, 2, 0.08)',
    rim: '#f59e0b',
  },
}

function getBoldPalette(project) {
  return (
    BOLD_PALETTES[project.id] || {
      start: project.accent || '#6366f1',
      end: '#1e1b4b',
      ink: '#ffffff',
      muted: 'rgba(255, 255, 255, 0.74)',
      line: 'rgba(255, 255, 255, 0.22)',
      watermark: 'rgba(255, 255, 255, 0.08)',
      rim: project.accent || '#6366f1',
    }
  )
}

function wrapTitleLines(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const w of words) {
    const test = current ? `${current} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = w
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

function createProjectCardTexture(project) {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 640
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const p = getBoldPalette(project)
  const radius = 32

  // Full-bleed bold tonal gradient
  ctx.beginPath()
  ctx.roundRect(0, 0, 1024, 640, radius)
  ctx.save()
  ctx.clip()

  const bg = ctx.createLinearGradient(0, 0, 1024, 640)
  bg.addColorStop(0, p.start)
  bg.addColorStop(1, p.end)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 1024, 640)

  // Soft overhead light bloom for sculptural depth
  const bloom = ctx.createRadialGradient(220, 80, 0, 220, 80, 620)
  bloom.addColorStop(0, 'rgba(255, 255, 255, 0.18)')
  bloom.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = bloom
  ctx.fillRect(0, 0, 1024, 640)

  // Oversized minimal ghost index watermark bleeding off right edge
  ctx.font = '900 420px "Inter Tight", Inter, system-ui, sans-serif'
  ctx.fillStyle = p.watermark
  ctx.textAlign = 'right'
  ctx.fillText(project.index || '01', 1010, 490)

  // Top bar: index (left) + category (right)
  ctx.font = '700 24px "JetBrains Mono", ui-monospace, monospace'
  ctx.fillStyle = p.muted
  ctx.textAlign = 'left'
  ctx.fillText(project.index || '01', 64, 84)

  ctx.textAlign = 'right'
  ctx.fillText((project.category || '').toUpperCase(), 960, 84)

  // Minimal bold poster headline (left-aligned, tight tracking)
  ctx.fillStyle = p.ink
  ctx.textAlign = 'left'
  const title = project.title
  let titleSize = 104
  let lines = []
  do {
    ctx.font = `900 ${titleSize}px "Inter Tight", Inter, system-ui, sans-serif`
    lines = wrapTitleLines(ctx, title, 860)
    if (lines.length <= 2) break
    titleSize -= 4
  } while (titleSize > 58)

  const lineHeight = titleSize * 1.04
  const startY = lines.length === 1 ? 375 : 335
  lines.forEach((line, i) => {
    ctx.fillText(line, 64, startY + i * lineHeight)
  })

  // Clean bottom hairline + minimal footer
  ctx.strokeStyle = p.line
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(64, 534)
  ctx.lineTo(960, 534)
  ctx.stroke()

  ctx.font = '600 22px "JetBrains Mono", ui-monospace, monospace'
  ctx.fillStyle = p.muted
  ctx.textAlign = 'left'
  ctx.fillText(project.year || '2026', 64, 584)

  ctx.textAlign = 'right'
  ctx.fillStyle = p.ink
  ctx.fillText('VIEW PROJECT ↗', 960, 584)

  ctx.restore()

  // Crisp subtle outer rim highlight
  ctx.beginPath()
  ctx.roundRect(2, 2, 1020, 636, radius)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)'
  ctx.lineWidth = 3
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}

function getProjectCardTexture(project) {
  const key = `bold-${project.id}`
  if (textureCache.has(key)) return textureCache.get(key)
  const tex = createProjectCardTexture(project)
  if (tex) textureCache.set(key, tex)
  return tex
}

const HOME_OFFSETS = {
  left: { x: -2.4, y: 0, rx: 0, ry: 0.42 },
  right: { x: 2.4, y: 0, rx: 0, ry: -0.42 },
  top: { x: 0, y: 1.65, rx: 0.34, ry: 0 },
  bottom: { x: 0, y: -1.65, rx: -0.34, ry: 0 },
}

const ProjectTileMesh = memo(function ProjectTileMesh({
  position,
  rotation,
  project,
  indexOffset = 0,
  homeWall = 'left',
  isDimmed,
  isSelected,
  onSelect,
  onHover,
  onUnhover,
  config,
  isDark,
}) {
  const floatRef = useRef()
  const cardGroupRef = useRef()
  const glowMatRef = useRef()
  const sheenMatRef = useRef()

  const isHoveredRef = useRef(false)
  const hoverTilt = useRef({ x: 0, y: 0 })
  const pointerDownCoord = useRef({ x: 0, y: 0 })

  const texture = useMemo(() => getProjectCardTexture(project), [project])
  const softGlowTex = useMemo(() => getSoftGlowTexture(), [])
  const sheenTex = useMemo(() => getSheenTexture(), [])
  const { heroBox, heroPlane } = getSharedGeometries(config)
  const palette = useMemo(() => getBoldPalette(project), [project])

  // Solid bold-color 3D slab materials: color-matched anodized side rims + minimal poster face
  const boxMaterials = useMemo(() => {
    const rim = new THREE.MeshStandardMaterial({
      color: palette.rim,
      metalness: 0.35,
      roughness: 0.28,
      emissive: palette.start,
      emissiveIntensity: isDark ? 0.26 : 0.1,
      transparent: true,
      opacity: 1,
    })
    const back = new THREE.MeshStandardMaterial({
      color: palette.end,
      metalness: 0.25,
      roughness: 0.5,
      transparent: true,
      opacity: 1,
    })
    const front = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
    })
    return [rim, rim, rim, rim, front, back]
  }, [texture, isDark, palette])

  useEffect(() => {
    return () => {
      boxMaterials[0].dispose()
      boxMaterials[4].dispose()
      boxMaterials[5].dispose()
    }
  }, [boxMaterials])

  // Smooth 3D home-wall -> center -> home-wall choreography + idle float + interactive pointer tilt
  useFrame(({ clock, camera }, rawDelta) => {
    if (!floatRef.current || !cardGroupRef.current || isSelected) return
    const dt = Math.min(rawDelta, 0.05)
    const t = clock.getElapsedTime()
    const home = HOME_OFFSETS[homeWall] || HOME_OFFSETS.left

    // Distance in front of camera: sweet spot (~3.0..6.8) sits dead-center (offsetWeight = 0);
    // far ahead (> 6.8) or scrolled past (< 3.0) glides smoothly back to its original home wall.
    const dz = camera.position.z - position[2]
    let offsetWeight = 0
    if (dz > 6.8) {
      const u = Math.min(1, (dz - 6.8) / 4.8)
      offsetWeight = u * u * (3 - 2 * u)
    } else if (dz < 3.0) {
      const u = Math.min(1, (3.0 - dz) / 2.4)
      offsetWeight = u * u * (3 - 2 * u)
    }

    const targetX = home.x * offsetWeight
    const targetY = home.y * offsetWeight + Math.sin(t * 1.15 + indexOffset * 2.1) * 0.055

    const restRotX = home.rx * offsetWeight + Math.cos(t * 0.8 + indexOffset * 1.7) * 0.02
    const restRotY = home.ry * offsetWeight + (home.ry !== 0 ? Math.sign(home.ry) * 0.06 : 0)

    const k = 1 - Math.exp(-dt * 8.0)
    floatRef.current.position.x += (targetX - floatRef.current.position.x) * k
    floatRef.current.position.y += (targetY - floatRef.current.position.y) * k

    const targetRotX = isHoveredRef.current ? hoverTilt.current.x : restRotX
    const targetRotY = isHoveredRef.current ? hoverTilt.current.y : restRotY

    cardGroupRef.current.rotation.x += (targetRotX - cardGroupRef.current.rotation.x) * k
    cardGroupRef.current.rotation.y += (targetRotY - cardGroupRef.current.rotation.y) * k
  })

  useEffect(() => {
    const targetOp = isDimmed ? 0.14 : 1
    gsap.to(boxMaterials[0], { opacity: targetOp, duration: 0.35, ease: 'power2.out' })
    gsap.to(boxMaterials[4], { opacity: targetOp, duration: 0.35, ease: 'power2.out' })
    gsap.to(boxMaterials[5], { opacity: targetOp, duration: 0.35, ease: 'power2.out' })
  }, [isDimmed, boxMaterials])

  const handlePointerOver = (e) => {
    e.stopPropagation()
    isHoveredRef.current = true
    document.body.style.cursor = 'pointer'
    onHover()
    if (isSelected || !cardGroupRef.current) return
    gsap.to(cardGroupRef.current.position, { z: config.HOVER_Z, duration: 0.4, ease: 'power3.out' })
    gsap.to(cardGroupRef.current.scale, {
      x: config.HOVER_SCALE,
      y: config.HOVER_SCALE,
      z: 1.18,
      duration: 0.4,
      ease: 'power3.out',
    })
    if (glowMatRef.current) {
      gsap.to(glowMatRef.current, { opacity: 0.65, duration: 0.38, ease: 'power2.out' })
    }
    if (sheenMatRef.current) {
      gsap.to(sheenMatRef.current, { opacity: 0.9, duration: 0.35, ease: 'power2.out' })
    }
  }

  const handlePointerMove = (e) => {
    if (!isHoveredRef.current || isSelected || !e.uv) return
    const nx = (e.uv.x - 0.5) * 2 // -1..1
    const ny = (e.uv.y - 0.5) * 2 // -1..1
    hoverTilt.current.y = nx * 0.22
    hoverTilt.current.x = -ny * 0.16
  }

  const handlePointerOut = () => {
    isHoveredRef.current = false
    hoverTilt.current.x = 0
    hoverTilt.current.y = 0
    document.body.style.cursor = 'auto'
    onUnhover()
    if (!cardGroupRef.current) return
    gsap.to(cardGroupRef.current.position, { z: 0, duration: 0.4, ease: 'power3.out' })
    gsap.to(cardGroupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.4, ease: 'power3.out' })
    if (glowMatRef.current) {
      gsap.to(glowMatRef.current, { opacity: isDimmed ? 0.05 : 0.36, duration: 0.38, ease: 'power2.out' })
    }
    if (sheenMatRef.current) {
      gsap.to(sheenMatRef.current, { opacity: 0.45, duration: 0.35, ease: 'power2.out' })
    }
  }

  const triggerSelect = () => {
    if (!cardGroupRef.current) return
    const worldPos = new THREE.Vector3()
    cardGroupRef.current.getWorldPosition(worldPos)
    onSelect(project, [worldPos.x, worldPos.y, worldPos.z], rotation)
  }

  return (
    <group position={position} rotation={rotation}>
      <group ref={floatRef}>
        <group ref={cardGroupRef}>
          {/* Soft feathered radial 3D aura behind the slab */}
          <mesh geometry={heroPlane} position={[0, 0, -HERO_DEPTH / 2 - 0.2]} scale={[1.32, 1.42, 1]} raycast={() => null}>
            <meshBasicMaterial
              ref={glowMatRef}
              map={softGlowTex}
              color={project.accent || (isDark ? '#ffffff' : '#111111')}
              transparent
              opacity={isDimmed ? 0.05 : 0.36}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* 3D thick extruded card slab with metallic side rims */}
          <mesh
            geometry={heroBox}
            material={boxMaterials}
            onPointerDown={(e) => {
              pointerDownCoord.current = { x: e.clientX, y: e.clientY }
            }}
            onClick={(e) => {
              e.stopPropagation()
              const dx = Math.abs((e.clientX ?? pointerDownCoord.current.x) - pointerDownCoord.current.x)
              const dy = Math.abs((e.clientY ?? pointerDownCoord.current.y) - pointerDownCoord.current.y)
              if (dx < 14 && dy < 14) triggerSelect()
            }}
            onPointerOver={handlePointerOver}
            onPointerMove={handlePointerMove}
            onPointerOut={handlePointerOut}
          />

          {/* Subtle glass specular sheen floating right in front of the card face */}
          <mesh geometry={heroPlane} position={[0, 0, HERO_DEPTH / 2 + 0.012]} raycast={() => null}>
            <meshBasicMaterial
              ref={sheenMatRef}
              map={sheenTex}
              transparent
              opacity={0.45}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
})

const EmptyTileMesh = memo(function EmptyTileMesh({ position, rotation, config, isDark }) {
  const { emptyPlane, emptyBorder, cross } = getSharedGeometries(config)
  const { meshMat, borderMat, crossMat } = getEmptyMaterials(isDark)

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={emptyPlane} material={meshMat} />
      <lineSegments geometry={emptyBorder} material={borderMat} position={[0, 0, 0.005]} />
      <lineSegments geometry={cross} material={crossMat} />
    </group>
  )
})

export default memo(function Tile({
  position,
  rotation,
  project,
  indexOffset = 0,
  homeWall = 'left',
  isDimmed,
  isSelected,
  onSelect,
  onHover,
  onUnhover,
  config,
  isDark,
}) {
  if (project) {
    return (
      <ProjectTileMesh
        position={position}
        rotation={rotation}
        project={project}
        indexOffset={indexOffset}
        homeWall={homeWall}
        isDimmed={isDimmed}
        isSelected={isSelected}
        onSelect={onSelect}
        onHover={onHover}
        onUnhover={onUnhover}
        config={config}
        isDark={isDark}
      />
    )
  }
  return <EmptyTileMesh position={position} rotation={rotation} config={config} isDark={isDark} />
})
