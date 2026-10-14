import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

// Cache textures across all tiles to avoid duplicate canvas and GPU texture allocations
const textureCache = new Map()

// Shared geometries singletons (1 geometry reused by all 448 tiles instead of 1,200+ duplicates)
let sharedPlaneGeo = null
let sharedBorderGeo = null
let sharedCrossGeo = null

function getSharedGeometries(config) {
  if (!sharedPlaneGeo) {
    sharedPlaneGeo = new THREE.PlaneGeometry(config.TILE_W, config.TILE_H)
    sharedBorderGeo = new THREE.EdgesGeometry(sharedPlaneGeo)
    const points = [
      new THREE.Vector3(-0.09, 0, 0.01),
      new THREE.Vector3(0.09, 0, 0.01),
      new THREE.Vector3(0, -0.09, 0.01),
      new THREE.Vector3(0, 0.09, 0.01),
    ]
    sharedCrossGeo = new THREE.BufferGeometry().setFromPoints(points)
  }
  return {
    planeGeometry: sharedPlaneGeo,
    borderGeometry: sharedBorderGeo,
    crossGeometry: sharedCrossGeo
  }
}

// Shared materials for empty decorative tiles (reused across 420 tiles)
let darkEmptyMeshMat = null
let darkEmptyBorderMat = null
let darkEmptyCrossMat = null
let lightEmptyMeshMat = null
let lightEmptyBorderMat = null
let lightEmptyCrossMat = null

function getEmptyMaterials(isDark) {
  if (isDark) {
    if (!darkEmptyMeshMat) {
      darkEmptyMeshMat = new THREE.MeshStandardMaterial({
        color: '#0e0e13',
        transparent: true,
        opacity: 0.35,
        roughness: 0.88,
        metalness: 0.12,
        side: THREE.DoubleSide
      })
      darkEmptyBorderMat = new THREE.LineBasicMaterial({
        color: '#262632',
        transparent: true,
        opacity: 0.4
      })
      darkEmptyCrossMat = new THREE.LineBasicMaterial({
        color: '#3f3f50',
        transparent: true,
        opacity: 0.35
      })
    }
    return {
      meshMat: darkEmptyMeshMat,
      borderMat: darkEmptyBorderMat,
      crossMat: darkEmptyCrossMat
    }
  } else {
    if (!lightEmptyMeshMat) {
      lightEmptyMeshMat = new THREE.MeshStandardMaterial({
        color: '#e6e6ed',
        transparent: true,
        opacity: 0.45,
        roughness: 0.88,
        metalness: 0.12,
        side: THREE.DoubleSide
      })
      lightEmptyBorderMat = new THREE.LineBasicMaterial({
        color: '#cbd5e1',
        transparent: true,
        opacity: 0.55
      })
      lightEmptyCrossMat = new THREE.LineBasicMaterial({
        color: '#94a3b8',
        transparent: true,
        opacity: 0.45
      })
    }
    return {
      meshMat: lightEmptyMeshMat,
      borderMat: lightEmptyBorderMat,
      crossMat: lightEmptyCrossMat
    }
  }
}

// Dynamically generate a high-contrast, typography-focused 3D card texture (called ONCE per project)
function createProjectCardTexture(project, isDark) {
  if (typeof document === 'undefined') return null

  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 640
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Background plate
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 640)
  if (isDark) {
    bgGrad.addColorStop(0, '#14141c')
    bgGrad.addColorStop(1, '#0a0a0f')
  } else {
    bgGrad.addColorStop(0, '#ffffff')
    bgGrad.addColorStop(1, '#f1f2f6')
  }
  ctx.fillStyle = bgGrad
  ctx.beginPath()
  ctx.roundRect(0, 0, 1024, 640, 24)
  ctx.fill()

  // Inner border in accent color
  ctx.strokeStyle = project.accent || (isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)')
  ctx.lineWidth = 6
  ctx.stroke()

  // Top Row: Index Tag & Live Status
  ctx.fillStyle = project.accent || (isDark ? '#10b981' : '#059669')
  ctx.font = 'bold 26px system-ui, -apple-system, sans-serif'
  ctx.fillText(`[ ${project.index} ]  ${project.category.toUpperCase()}`, 52, 78)

  ctx.fillStyle = '#10b981'
  ctx.beginPath()
  ctx.arc(920, 70, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif'
  ctx.fillText('LIVE', 938, 77)

  // Divider
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(52, 115)
  ctx.lineTo(972, 115)
  ctx.stroke()

  // Huge, High-Visibility Project Title (Focus of the card)
  ctx.fillStyle = isDark ? '#ffffff' : '#09090b'
  ctx.font = '900 64px system-ui, -apple-system, sans-serif'

  // Wrap title cleanly so it fills the space with authority
  if (project.title.length > 22) {
    const words = project.title.split(' ')
    const mid = Math.ceil(words.length / 2)
    const line1 = words.slice(0, mid).join(' ')
    const line2 = words.slice(mid).join(' ')
    ctx.fillText(line1, 52, 240)
    ctx.fillText(line2, 52, 320)
  } else {
    ctx.fillText(project.title, 52, 270)
  }

  // Subtitle
  ctx.fillStyle = isDark ? '#a1a1aa' : '#52525b'
  ctx.font = '600 28px system-ui, -apple-system, sans-serif'
  ctx.fillText(project.subtitle, 52, 400)

  // Tech list single line summary
  ctx.fillStyle = isDark ? '#71717a' : '#9ca3af'
  ctx.font = '500 24px system-ui, -apple-system, sans-serif'
  ctx.fillText(project.techString || project.tech.join('  ·  '), 52, 450)

  // Bottom interactive cue
  ctx.fillStyle = project.accent || (isDark ? '#38bdf8' : '#0284c7')
  ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
  ctx.fillText('CLICK TO VIEW DETAILS →', 52, 580)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function getProjectCardTexture(project, isDark) {
  const key = `${project.id}-${isDark ? 'dark' : 'light'}`
  if (textureCache.has(key)) {
    return textureCache.get(key)
  }
  const tex = createProjectCardTexture(project, isDark)
  if (tex) {
    textureCache.set(key, tex)
  }
  return tex
}

// Subcomponent for interactive real project typography cards
function ProjectTileMesh({
  position,
  rotation,
  project,
  isDimmed,
  isSelected,
  onSelect,
  onHover,
  onUnhover,
  config,
  isDark
}) {
  const groupRef = useRef()
  const meshRef = useRef()
  const pointerDownCoord = useRef({ x: 0, y: 0 })

  const texture = useMemo(() => {
    return getProjectCardTexture(project, isDark)
  }, [project, isDark])

  const { planeGeometry, borderGeometry } = getSharedGeometries(config)

  // Dim / brighten effect
  useEffect(() => {
    if (!meshRef.current) return
    gsap.to(meshRef.current.material, {
      opacity: isDimmed ? 0.18 : 1,
      duration: 0.35,
      ease: 'power2.out'
    })
  }, [isDimmed])

  const handlePointerOver = (e) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
    onHover()
    if (isSelected || !meshRef.current) return

    // Lift forward locally along normal Z (from 0 to HOVER_Z)
    gsap.to(meshRef.current.position, {
      z: config.HOVER_Z,
      duration: 0.28,
      ease: 'power2.out'
    })
    gsap.to(meshRef.current.scale, {
      x: config.HOVER_SCALE,
      y: config.HOVER_SCALE,
      z: config.HOVER_SCALE,
      duration: 0.28,
      ease: 'power2.out'
    })
    gsap.to(meshRef.current.material, {
      emissiveIntensity: 0.35,
      duration: 0.2
    })
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'
    onUnhover()
    if (!meshRef.current) return

    // Return to resting local position 0
    gsap.to(meshRef.current.position, {
      z: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
    gsap.to(meshRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
    gsap.to(meshRef.current.material, {
      emissiveIntensity: 0.08,
      duration: 0.2
    })
  }

  const triggerSelect = () => {
    if (!meshRef.current) return
    const worldPos = new THREE.Vector3()
    meshRef.current.getWorldPosition(worldPos)
    onSelect(project, [worldPos.x, worldPos.y, worldPos.z], rotation)
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        geometry={planeGeometry}
        onPointerDown={(e) => {
          pointerDownCoord.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerUp={(e) => {
          const dx = Math.abs(e.clientX - pointerDownCoord.current.x)
          const dy = Math.abs(e.clientY - pointerDownCoord.current.y)
          if (dx < 8 && dy < 8) {
            e.stopPropagation()
            triggerSelect()
          }
        }}
        onClick={(e) => {
          e.stopPropagation()
          triggerSelect()
        }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.35}
          metalness={0.15}
          emissive={project.accent || '#ffffff'}
          emissiveIntensity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glowing project accent border */}
      <lineSegments geometry={borderGeometry} position={[0, 0, 0.01]}>
        <lineBasicMaterial
          color={project.accent || '#ffffff'}
          transparent
          opacity={isDark ? 0.9 : 0.75}
        />
      </lineSegments>
    </group>
  )
}

// Subcomponent for empty default architectural bays using shared pooled objects
function EmptyTileMesh({ position, rotation, config, isDark }) {
  const { planeGeometry, borderGeometry, crossGeometry } = getSharedGeometries(config)
  const { meshMat, borderMat, crossMat } = getEmptyMaterials(isDark)

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={planeGeometry} material={meshMat} />
      <lineSegments geometry={borderGeometry} material={borderMat} position={[0, 0, 0.005]} />
      <lineSegments geometry={crossGeometry} material={crossMat} />
    </group>
  )
}

export default function Tile({
  position,
  rotation,
  project,
  isDimmed,
  isSelected,
  onSelect,
  onHover,
  onUnhover,
  config,
  isDark
}) {
  if (project) {
    return (
      <ProjectTileMesh
        position={position}
        rotation={rotation}
        project={project}
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

  return (
    <EmptyTileMesh
      position={position}
      rotation={rotation}
      config={config}
      isDark={isDark}
    />
  )
}