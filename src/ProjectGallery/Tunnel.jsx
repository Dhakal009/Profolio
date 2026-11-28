import { useMemo } from 'react'
import * as THREE from 'three'
import Tile from './Tile'
import { CONFIG, PROJECT_SLOTS } from './data'

// Seeded deterministic pseudo-random generator
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export default function Tunnel({
  projects,
  onSelect,
  setHoveredId,
  selectedId,
  isMobile,
  isDark,
}) {
  const halfW = CONFIG.TUNNEL_W / 2
  const halfH = CONFIG.TUNNEL_H / 2
  const rowsCount = CONFIG.ROWS
  const totalLength = (rowsCount - 1) * CONFIG.ROW_SPACING
  const cols = isMobile ? CONFIG.COLS_MOBILE : CONFIG.COLS_DESKTOP

  // Merge all transverse tunnel rings + 4 corner rails into ONE BufferGeometry (1 draw call)
  const structureGeometry = useMemo(() => {
    const pts = []
    for (let i = 0; i < rowsCount; i++) {
      const z = -i * CONFIG.ROW_SPACING
      pts.push(
        new THREE.Vector3(-halfW, -halfH, z),
        new THREE.Vector3(halfW, -halfH, z),
        new THREE.Vector3(halfW, -halfH, z),
        new THREE.Vector3(halfW, halfH, z),
        new THREE.Vector3(halfW, halfH, z),
        new THREE.Vector3(-halfW, halfH, z),
        new THREE.Vector3(-halfW, halfH, z),
        new THREE.Vector3(-halfW, -halfH, z)
      )
    }
    const endZ = -totalLength - 8
    pts.push(
      new THREE.Vector3(-halfW, -halfH, 12),
      new THREE.Vector3(-halfW, -halfH, endZ),
      new THREE.Vector3(halfW, -halfH, 12),
      new THREE.Vector3(halfW, -halfH, endZ),
      new THREE.Vector3(-halfW, halfH, 12),
      new THREE.Vector3(-halfW, halfH, endZ),
      new THREE.Vector3(halfW, halfH, 12),
      new THREE.Vector3(halfW, halfH, endZ)
    )
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [halfW, halfH, rowsCount, totalLength])

  // Distinct end-of-tunnel ring
  const endRingGeometry = useMemo(() => {
    const z = -totalLength
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-halfW, -halfH, z),
      new THREE.Vector3(halfW, -halfH, z),
      new THREE.Vector3(halfW, -halfH, z),
      new THREE.Vector3(halfW, halfH, z),
      new THREE.Vector3(halfW, halfH, z),
      new THREE.Vector3(-halfW, halfH, z),
      new THREE.Vector3(-halfW, halfH, z),
      new THREE.Vector3(-halfW, -halfH, z),
    ])
  }, [halfW, halfH, totalLength])

  // Unique hero project tiles positioned along the center corridor with distinct home walls
  const heroTiles = useMemo(() => {
    const walls = ['left', 'right', 'top', 'bottom']
    return projects.map((project, idx) => {
      const slot = PROJECT_SLOTS[idx] || {
        row: 1.5 + idx * 3,
        wall: walls[idx % walls.length],
      }
      const z = -slot.row * CONFIG.ROW_SPACING
      return {
        key: `hero-${project.id}`,
        project,
        indexOffset: idx,
        homeWall: slot.wall,
        position: [0, 0, z],
        rotation: [0, 0, 0],
      }
    })
  }, [projects])

  // Walls stay cleanly symmetrical since hero cards float in the center corridor
  const occupiedWalls = useMemo(() => new Set(), [])

  // Lightweight architectural backdrop tiles (no click/hover listeners)
  const emptyTiles = useMemo(() => {
    const data = []
    const walls = ['left', 'right', 'floor', 'ceiling']
    const stepX = CONFIG.TILE_W + CONFIG.GAP
    const stepY = CONFIG.TILE_H + CONFIG.GAP

    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
      const rand = mulberry32(200 + rowIndex * 31)
      const zBase = -rowIndex * CONFIG.ROW_SPACING

      for (let w = 0; w < 4; w++) {
        const wall = walls[w]
        if (occupiedWalls.has(`${rowIndex}-${wall}`)) continue

        for (let c = 0; c < cols; c++) {
          const tiltX = (rand() - 0.5) * CONFIG.TILT_RANGE * (Math.PI / 180)
          const tiltY = (rand() - 0.5) * CONFIG.TILT_RANGE * (Math.PI / 180)
          const tiltZ = (rand() - 0.5) * CONFIG.TILT_RANGE * (Math.PI / 180)
          const zJitter = (rand() - 0.5) * CONFIG.Z_JITTER

          let x = 0
          let y = 0
          let rx = tiltX
          let ry = tiltY
          let rz = tiltZ

          if (wall === 'left') {
            x = -halfW
            y = (c - (cols - 1) / 2) * stepY
            ry += Math.PI / 2
          } else if (wall === 'right') {
            x = halfW
            y = (c - (cols - 1) / 2) * stepY
            ry -= Math.PI / 2
          } else if (wall === 'floor') {
            y = -halfH
            x = (c - (cols - 1) / 2) * stepX
            rx += Math.PI / 2
          } else {
            y = halfH
            x = (c - (cols - 1) / 2) * stepX
            rx -= Math.PI / 2
          }

          data.push({
            key: `bg-${rowIndex}-${wall}-${c}`,
            position: [x, y, zBase + zJitter],
            rotation: [rx, ry, rz],
          })
        }
      }
    }

    return data
  }, [rowsCount, cols, halfW, halfH, occupiedWalls])

  return (
    <group>
      {/* Merged structural rings + 4 corner rails (single draw call) */}
      <lineSegments geometry={structureGeometry}>
        <lineBasicMaterial
          color={isDark ? '#262834' : '#cbd5e1'}
          transparent
          opacity={isDark ? 0.5 : 0.68}
        />
      </lineSegments>

      {/* Distinct end frame ring */}
      <lineSegments geometry={endRingGeometry}>
        <lineBasicMaterial
          color={isDark ? '#ffffff' : '#111111'}
          transparent
          opacity={isDark ? 0.55 : 0.4}
        />
      </lineSegments>

      {/* Architectural backdrop panels */}
      {emptyTiles.map((t) => (
        <Tile
          key={t.key}
          position={t.position}
          rotation={t.rotation}
          project={null}
          config={CONFIG}
          isDark={isDark}
        />
      ))}

      {/* Unique, oversized hero project cards */}
      {heroTiles.map((t) => (
        <Tile
          key={t.key}
          position={t.position}
          rotation={t.rotation}
          project={t.project}
          indexOffset={t.indexOffset}
          homeWall={t.homeWall}
          config={CONFIG}
          isDark={isDark}
          isDimmed={selectedId !== null && selectedId !== t.project.id}
          isSelected={selectedId === t.project.id}
          onHover={() => setHoveredId(t.key)}
          onUnhover={() => setHoveredId(null)}
          onSelect={onSelect}
        />
      ))}
    </group>
  )
}
