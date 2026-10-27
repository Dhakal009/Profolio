import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

const textureCache = new Map()
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
        color: '#14141a',
        transparent: true,
        opacity: 0.28,
        roughness: 0.9,
        metalness: 0.05,
        side: THREE.DoubleSide
      })
      darkEmptyBorderMat = new THREE.LineBasicMaterial({ color: '#252536', transparent: true, opacity: 0.25 })
      darkEmptyCrossMat = new THREE.LineBasicMaterial({ color: '#2a2a3a', transparent: true, opacity: 0.2 })
    }
    return { meshMat: darkEmptyMeshMat, borderMat: darkEmptyBorderMat, crossMat: darkEmptyCrossMat }
  } else {
    if (!lightEmptyMeshMat) {
      lightEmptyMeshMat = new THREE.MeshStandardMaterial({
        color: '#f1f5f9',
        transparent: true,
        opacity: 0.6,
        roughness: 0.9,
        metalness: 0.05,
        side: THREE.DoubleSide
      })
      lightEmptyBorderMat = new THREE.LineBasicMaterial({ color: '#e2e8f0', transparent: true, opacity: 0.8 })
      lightEmptyCrossMat = new THREE.LineBasicMaterial({ color: '#cbd5e1', transparent: true, opacity: 0.35 })
    }
    return { meshMat: lightEmptyMeshMat, borderMat: lightEmptyBorderMat, crossMat: lightEmptyCrossMat }
  }
}

function createProjectCardTexture(project, isDark) {
  if (typeof document === 'undefined') return null
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 640
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const radius = 28
  const isBlack = isDark

  // --- BACKGROUND INVERTED ---
  ctx.beginPath()
  ctx.roundRect(0, 0, 1024, 640, radius)
  const background = ctx.createLinearGradient(0, 0, 1024, 640)
  background.addColorStop(0, isBlack ? '#111318' : '#ffffff')
  background.addColorStop(1, isBlack ? '#050608' : '#eef2f7')
  ctx.fillStyle = background
  ctx.fill()

  ctx.strokeStyle = isBlack ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.12)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Soft monochrome wash keeps the cards consistent with the site theme.
  const wash = ctx.createRadialGradient(860, 110, 0, 860, 110, 430)
  wash.addColorStop(0, isBlack ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)')
  wash.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = wash
  ctx.fillRect(0, 0, 1024, 640)

  // Top accent bar
  const accentBar = ctx.createLinearGradient(0, 0, 1024, 0)
  accentBar.addColorStop(0, isBlack ? '#ffffff' : '#111111')
  accentBar.addColorStop(1, isBlack ? 'rgba(255,255,255,0.25)' : 'rgba(17,17,17,0.2)')
  ctx.fillStyle = accentBar
  ctx.beginPath()
  ctx.roundRect(0, 0, 1024, 8, [radius, radius, 0, 0])
  ctx.fill()

  // The tunnel card intentionally uses only the project name.
  ctx.fillStyle = isBlack ? '#ffffff' : '#09090b'
  const title = project.title.toUpperCase()
  let titleSize = 92
  ctx.textAlign = 'center'
  do {
    ctx.font = `900 ${titleSize}px Inter Tight, Inter, system-ui, sans-serif`
    titleSize -= 2
  } while (ctx.measureText(title).width > 900 && titleSize > 42)
  ctx.font = `900 ${titleSize}px Inter Tight, Inter, system-ui, sans-serif`
  ctx.fillText(title, 512, 340)
  ctx.strokeStyle = isBlack ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(270, 400)
  ctx.lineTo(754, 400)
  ctx.stroke()
  ctx.textAlign = 'left'

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}


function getProjectCardTexture(project, isDark) {
  const key = `${project.id}-${isDark ? 'dark' : 'light'}`
  if (textureCache.has(key)) return textureCache.get(key)
  const tex = createProjectCardTexture(project, isDark)
  if (tex) textureCache.set(key, tex)
  return tex
}

function ProjectTileMesh({ position, rotation, project, isDimmed, isSelected, onSelect, onHover, onUnhover, config, isDark }) {
  const groupRef = useRef()
  const meshRef = useRef()
  const pointerDownCoord = useRef({ x: 0, y: 0 })
  const texture = useMemo(() => getProjectCardTexture(project, isDark), [project, isDark])
  const { planeGeometry, borderGeometry } = getSharedGeometries(config)

  useEffect(() => {
    if (!meshRef.current) return
    gsap.to(meshRef.current.material, { opacity: isDimmed ? 0.15 : 1, duration: 0.35, ease: 'power2.out' })
  }, [isDimmed])

  const handlePointerOver = (e) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
    onHover()
    if (isSelected || !meshRef.current) return
    gsap.to(meshRef.current.position, { z: config.HOVER_Z, duration: 0.3, ease: 'power3.out' })
    gsap.to(meshRef.current.scale, { x: config.HOVER_SCALE, y: config.HOVER_SCALE, z: 1, duration: 0.3, ease: 'power3.out' })
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'
    onUnhover()
    if (!meshRef.current) return
    gsap.to(meshRef.current.position, { z: 0, duration: 0.3, ease: 'power3.out' })
    gsap.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'power3.out' })
  }

  const triggerSelect = () => {
    if (!meshRef.current) return
    const worldPos = new THREE.Vector3()
    meshRef.current.getWorldPosition(worldPos)
    onSelect(project, [worldPos.x, worldPos.y, worldPos.z], rotation)
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <mesh geometry={planeGeometry} position={[0, 0, -0.035]} scale={[1.035, 1.06, 1]}>
        <meshBasicMaterial
          color={isDark ? '#ffffff' : '#111111'}
          transparent
          opacity={isDimmed ? 0.04 : 0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh
        ref={meshRef}
        geometry={planeGeometry}
        onPointerDown={(e) => { pointerDownCoord.current = { x: e.clientX, y: e.clientY } }}
        onClick={(e) => {
          e.stopPropagation()
          const dx = Math.abs((e.clientX ?? pointerDownCoord.current.x) - pointerDownCoord.current.x)
          const dy = Math.abs((e.clientY ?? pointerDownCoord.current.y) - pointerDownCoord.current.y)
          if (dx < 14 && dy < 14) triggerSelect()
        }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          map={texture}
          transparent={false}
          roughness={0.45}
          metalness={0.08}
          emissive={isDark ? '#ffffff' : '#111111'}
          emissiveIntensity={isDimmed ? 0.02 : 0.055}
          side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={borderGeometry} position={[0, 0, 0.02]}>
        <lineBasicMaterial color={isDark ? '#ffffff' : '#111111'} transparent opacity={isDimmed ? 0.25 : 0.88} />
      </lineSegments>
    </group>
  )
}

function EmptyTileMesh({ position, rotation, config, isDark, project, onSelect }) {
  const { planeGeometry, borderGeometry, crossGeometry } = getSharedGeometries(config)
  const { meshMat, borderMat, crossMat } = getEmptyMaterials(isDark)
  const meshRef = useRef()
  const pointerDownCoord = useRef({ x: 0, y: 0 })

  const triggerSelect = () => {
    if (!meshRef.current || !project || !onSelect) return
    const worldPos = new THREE.Vector3()
    meshRef.current.getWorldPosition(worldPos)
    onSelect(project, [worldPos.x, worldPos.y, worldPos.z], rotation)
  }

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        geometry={planeGeometry}
        material={meshMat}
        onPointerDown={(e) => { pointerDownCoord.current = { x: e.clientX, y: e.clientY } }}
        onClick={(e) => {
          e.stopPropagation()
          const dx = Math.abs((e.clientX ?? pointerDownCoord.current.x) - pointerDownCoord.current.x)
          const dy = Math.abs((e.clientY ?? pointerDownCoord.current.y) - pointerDownCoord.current.y)
          if (dx < 14 && dy < 14) triggerSelect()
        }}
        onPointerOver={(e) => { if (project) { e.stopPropagation(); document.body.style.cursor = 'pointer' }}}
        onPointerOut={() => { document.body.style.cursor = 'auto' }}
      />
      <lineSegments geometry={borderGeometry} material={borderMat} position={[0, 0, 0.005]} />
      <lineSegments geometry={crossGeometry} material={crossMat} />
    </group>
  )
}

export default function Tile({ position, rotation, project, fallbackProject, isDimmed, isSelected, onSelect, onHover, onUnhover, config, isDark }) {
  if (project) {
    return <ProjectTileMesh position={position} rotation={rotation} project={project} isDimmed={isDimmed} isSelected={isSelected} onSelect={onSelect} onHover={onHover} onUnhover={onUnhover} config={config} isDark={isDark} />
  }
  return <EmptyTileMesh position={position} rotation={rotation} config={config} isDark={isDark} project={fallbackProject} onSelect={onSelect} />
}