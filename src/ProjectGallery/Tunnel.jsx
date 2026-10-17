import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import Tile from './Tile'
import { CONFIG } from './data'

// Seeded deterministic pseudo-random generator
function mulberry32(a) {
  return function() {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Single transverse row of the tunnel
function TunnelRow({
  rowIndex,
  zBase,
  projects,
  onSelect,
  setHoveredId,
  selectedId,
  isMobile,
  isDark,
  ringGeometry,
  rowRef,
  randomPlacements
}) {
  const cols = isMobile ? CONFIG.COLS_MOBILE : CONFIG.COLS_DESKTOP

  const tiles = useMemo(() => {
    const rand = mulberry32(200 + rowIndex * 31)
    const data = []
    const walls = ['left', 'right', 'floor', 'ceiling']
    const stepX = CONFIG.TILE_W + CONFIG.GAP
    const stepY = CONFIG.TILE_H + CONFIG.GAP

    for (let c = 0; c < cols; c++) {
      for (let w = 0; w < 4; w++) {
        const wall = walls[w]

        const tiltX = (rand() - 0.5) * CONFIG.TILT_RANGE * (Math.PI / 180)
        const tiltY = (rand() - 0.5) * CONFIG.TILT_RANGE * (Math.PI / 180)
        const tiltZ = (rand() - 0.5) * CONFIG.TILT_RANGE * (Math.PI / 180)
        const zJitter = (rand() - 0.5) * CONFIG.Z_JITTER

        let x = 0, y = 0, rx = 0, ry = 0, rz = 0

        if (wall === 'left') {
          x = -CONFIG.TUNNEL_W / 2
          y = (c - (cols - 1) / 2) * stepY * 1.05
          ry = Math.PI / 2
          rx = tiltX
          rz = tiltZ
        } else if (wall === 'right') {
          x = CONFIG.TUNNEL_W / 2
          y = (c - (cols - 1) / 2) * stepY * 1.05
          ry = -Math.PI / 2
          rx = tiltX
          rz = tiltZ
        } else if (wall === 'floor') {
          y = -CONFIG.TUNNEL_H / 2
          x = (c - (cols - 1) / 2) * stepX * 1.05
          rx = Math.PI / 2
          ry = tiltY
          rz = tiltZ
        } else if (wall === 'ceiling') {
          y = CONFIG.TUNNEL_H / 2
          x = (c - (cols - 1) / 2) * stepX * 1.05
          rx = -Math.PI / 2
          ry = tiltY
          rz = tiltZ
        }

        rx += tiltX
        ry += tiltY
        rz += tiltZ

        // Check if this slot has a randomly assigned project
        const slotKey = `${rowIndex}-${wall}-${c % 2}`
        const projectIndex = randomPlacements[slotKey]
        const project = projectIndex !== undefined ? projects[projectIndex % projects.length] : null

        data.push({
          key: `tile-${rowIndex}-${wall}-${c}`,
          position: [x, y, zJitter],
          rotation: [rx, ry, rz],
          project
        })
      }
    }

    return data
  }, [rowIndex, projects, cols, randomPlacements])

  return (
    <group ref={rowRef} position={[0, 0, zBase]}>
      {/* Structural transverse ring */}
      <lineSegments geometry={ringGeometry}>
        <lineBasicMaterial
          color={isDark ? '#23232c' : '#cbd5e1'}
          transparent
          opacity={isDark ? 0.45 : 0.6}
        />
      </lineSegments>

      {/* Row Tiles */}
      {tiles.map((t, idx) => (
        <Tile
          key={t.key}
          position={t.position}
          rotation={t.rotation}
          project={t.project}
          fallbackProject={projects[(rowIndex + idx) % projects.length]}
          config={CONFIG}
          isDark={isDark}
          isDimmed={selectedId !== null && (!t.project || selectedId !== t.project.id)}
          isSelected={Boolean(selectedId && t.project && selectedId === t.project.id)}
          onHover={() => setHoveredId(t.key)}
          onUnhover={() => setHoveredId(null)}
          onSelect={onSelect}
        />
      ))}
    </group>
  )
}

export default function Tunnel({
  projects,
  onSelect,
  setHoveredId,
  selectedId,
  isMobile,
  isDark
}) {
  const rowRefs = useRef([])

  const halfW = CONFIG.TUNNEL_W / 2
  const halfH = CONFIG.TUNNEL_H / 2

  // REDUCED LENGTH - 30% shorter (0.7 = -30%, change to 0.6 for -40%, 0.5 for half)
  const EFFECTIVE_ROWS = Math.floor(CONFIG.ROWS * 0.7)

  // Distribute projects richly across all rows and walls so project cards are readily accessible
  const randomPlacements = useMemo(() => {
    const map = {}
    const walls = ['left', 'floor', 'right', 'ceiling']

    for (let r = 0; r < EFFECTIVE_ROWS; r++) {
      const pIdx = r % projects.length
      const wall1 = walls[r % 4]
      const wall2 = walls[(r + 2) % 4]
      map[`${r}-${wall1}-0`] = pIdx
      map[`${r}-${wall2}-1`] = (pIdx + 1) % projects.length
    }

    return map
  }, [projects.length, EFFECTIVE_ROWS])

  // Shared transverse ring geometry
  const ringGeometry = useMemo(() => {
    const points = [
      new THREE.Vector3(-halfW, -halfH, 0),
      new THREE.Vector3(halfW, -halfH, 0),
      new THREE.Vector3(halfW, -halfH, 0),
      new THREE.Vector3(halfW, halfH, 0),
      new THREE.Vector3(halfW, halfH, 0),
      new THREE.Vector3(-halfW, halfH, 0),
      new THREE.Vector3(-halfW, halfH, 0),
      new THREE.Vector3(-halfW, -halfH, 0)
    ]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [halfW, halfH])

  const totalLength = (EFFECTIVE_ROWS - 1) * CONFIG.ROW_SPACING

  // Corner rails geometry spanning the finite length of the tunnel
  const railGeometry = useMemo(() => {
    const endZ = -totalLength - 10
    const points = [
      new THREE.Vector3(-halfW, -halfH, 15),
      new THREE.Vector3(-halfW, -halfH, endZ),
      new THREE.Vector3(halfW, -halfH, 15),
      new THREE.Vector3(halfW, -halfH, endZ),
      new THREE.Vector3(-halfW, halfH, 15),
      new THREE.Vector3(-halfW, halfH, endZ),
      new THREE.Vector3(halfW, halfH, 15),
      new THREE.Vector3(halfW, halfH, endZ)
    ]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [halfW, halfH, totalLength])

  const rows = useMemo(() => {
    return Array.from({ length: EFFECTIVE_ROWS }, (_, i) => ({
      index: i,
      zBase: -i * CONFIG.ROW_SPACING
    }))
  }, [EFFECTIVE_ROWS])

  return (
    <group>
      {/* 4 corner rails along the finite tunnel length */}
      <lineSegments geometry={railGeometry}>
        <lineBasicMaterial
          color={isDark ? '#2e2e3a' : '#94a3b8'}
          transparent
          opacity={isDark ? 0.6 : 0.75}
        />
      </lineSegments>

      {/* Finite rows arranged statically along the tunnel depth */}
      {rows.map((row) => (
        <TunnelRow
          key={row.index}
          rowIndex={row.index}
          zBase={row.zBase}
          projects={projects}
          onSelect={onSelect}
          setHoveredId={setHoveredId}
          selectedId={selectedId}
          isMobile={isMobile}
          isDark={isDark}
          ringGeometry={ringGeometry}
          randomPlacements={randomPlacements}
          rowRef={(el) => (rowRefs.current[row.index] = el)}
        />
      ))}

      {/* Distinct end frame ring marking the end of the finite tunnel */}
      <group position={[0, 0, -totalLength]}>
        <lineSegments geometry={ringGeometry}>
          <lineBasicMaterial
            color={isDark ? '#38bdf8' : '#0284c7'}
            transparent
            opacity={0.85}
          />
        </lineSegments>
      </group>
    </group>
  )
}