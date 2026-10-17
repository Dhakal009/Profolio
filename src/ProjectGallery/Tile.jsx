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

  const accent = project.accent || '#38bdf8'
  const radius = 28
  const isBlack = !isDark // INVERTED: light theme = black card, dark theme = white card

  // --- BACKGROUND INVERTED ---
  ctx.beginPath()
  ctx.roundRect(0, 0, 1024, 640, radius)
  ctx.fillStyle = isBlack ? '#09090b' : '#ffffff'
  ctx.fill()

  ctx.strokeStyle = isBlack ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'
  ctx.lineWidth = 2
  ctx.stroke()

  // Top accent bar
  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.roundRect(0, 0, 1024, 8, [radius, radius, 0, 0])
  ctx.fill()

  // --- Category Pill ---
  ctx.font = '800 20px Inter, system-ui, sans-serif'
  const catText = project.category.toUpperCase()
  const catWidth = ctx.measureText(catText).width + 40
  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.roundRect(36, 38, catWidth, 32, 16)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.fillText(catText, 56, 60)

  // Index
  ctx.fillStyle = isBlack ? 'rgba(255,255,255,0.5)' : '#94a3b8'
  ctx.font = '700 20px Inter, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(project.index, 988, 60)
  ctx.textAlign = 'left'

  // --- TITLE - BOLD SHORT ---
  ctx.fillStyle = isBlack ? '#ffffff' : '#09090b'
  let title = project.title.toUpperCase()
  if(title.length > 18) title = title.slice(0, 18) + '…'
  ctx.font = '900 68px Inter, system-ui, sans-serif'
  ctx.fillText(title, 36, 250)

  // --- Subtitle - BOLD SHORT ---
  let shortDesc = project.subtitle || ''
  if(shortDesc.length > 32) shortDesc = shortDesc.slice(0, 32) + '…'
  ctx.fillStyle = isBlack ? '#a1a1aa' : '#52525b'
  ctx.font = '800 26px Inter, system-ui, sans-serif'
  ctx.fillText(shortDesc, 36, 310)

  // --- Tech Pills - BOLD SHORT ---
  const techs = (project.tech || []).slice(0, 3)
  let pillX = 36
  const pillY = 380
  ctx.font = '800 17px Inter, system-ui, sans-serif'
  techs.forEach(t => {
    let shortTech = t.toUpperCase()
    if(shortTech.length > 10) shortTech = shortTech.slice(0, 10)
    const w = ctx.measureText(shortTech).width + 28
    ctx.fillStyle = isBlack ? 'rgba(255,255,255,0.10)' : '#f4f4f5'
    ctx.strokeStyle = isBlack ? 'rgba(255,255,255,0.14)' : '#e4e4e7'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.roundRect(pillX, pillY, w, 30, 15)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = isBlack ? '#ffffff' : '#18181b'
    ctx.fillText(shortTech, pillX + 14, pillY + 20)
    pillX += w + 10
  })

  // --- Bottom Bar ---
  ctx.strokeStyle = isBlack ? 'rgba(255,255,255,0.12)' : '#e4e4e7'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(36, 550)
  ctx.lineTo(988, 550)
  ctx.stroke()

  ctx.fillStyle = isBlack ? '#ffffff' : '#09090b'
  ctx.font = '900 22px Inter, system-ui, sans-serif'
  ctx.fillText('VIEW PROJECT', 36, 600)

  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.arc(956, 588, 24, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.font = '900 24px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('→', 956, 597)
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
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>
     <lineSegments geometry={borderGeometry} position={[0, 0, 0.02]}>
    <lineBasicMaterial color={project.accent || '#0ea5e9'} transparent opacity={0.95} />
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