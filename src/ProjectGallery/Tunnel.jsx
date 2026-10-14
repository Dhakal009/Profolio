import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
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
      {tiles.map((t) => (
        <Tile
          key={t.key}
          position={t.position}
          rotation={t.rotation}
          project={t.project}
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
  const railsRef = useRef()

  const L = CONFIG.CYCLE_LENGTH
  const halfW = CONFIG.TUNNEL_W / 2
  const halfH = CONFIG.TUNNEL_H / 2

  // Generate organic, scattered pseudo-random project assignments across ALL 4 walls
  const randomPlacements = useMemo(() => {
    const map = {}
    const walls = ['left', 'floor', 'right', 'ceiling']
    const rand = mulberry32(777)

    // Distribute projects across varied rows and all 4 walls
    for (let r = 0; r < CONFIG.ROWS; r += 2) {
      const wall = walls[Math.floor(rand() * walls.length)]
      const col = Math.floor(rand() * 2)
      const projectIdx = Math.floor(rand() * projects.length)
      map[`${r}-${wall}-${col}`] = projectIdx
    }

    // Ensure explicit showcase positions so each project is guaranteed represented
    map['1-left-0'] = 0     // EMS on left wall
    map['3-floor-1'] = 1    // Live Chat on floor
    map['5-right-0'] = 2    // E-Commerce on right wall
    map['7-ceiling-1'] = 0  // EMS on ceiling
    map['10-right-1'] = 1   // Live Chat on right wall
    map['13-left-1'] = 2    // E-Commerce on left wall
    map['16-floor-0'] = 0   // EMS on floor
    map['19-ceiling-0'] = 1 // Live Chat on ceiling
    map['22-left-0'] = 2    // E-Commerce on left wall
    map['25-right-1'] = 0   // EMS on right wall

    return map
  }, [projects.length])

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

  // Continuous corner rails geometry
  const railGeometry = useMemo(() => {
    const length = 120
    const points = [
      new THREE.Vector3(-halfW, -halfH, 15),
      new THREE.Vector3(-halfW, -halfH, -length),
      new THREE.Vector3(halfW, -halfH, 15),
      new THREE.Vector3(halfW, -halfH, -length),
      new THREE.Vector3(-halfW, halfH, 15),
      new THREE.Vector3(-halfW, halfH, -length),
      new THREE.Vector3(halfW, halfH, 15),
      new THREE.Vector3(halfW, halfH, -length)
    ]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [halfW, halfH])

  // Per-frame seamless row wrapping
  useFrame(({ camera }) => {
    const camZ = camera.position.z
    const offset = 8.0 // wrap boundary behind camera

    for (let r = 0; r < CONFIG.ROWS; r++) {
      const row = rowRefs.current[r]
      if (row) {
        const zBase = -r * CONFIG.ROW_SPACING
        const relZ = zBase - camZ
        const wrappedRelZ = (((relZ + offset) % L) + L) % L - offset
        row.position.z = camZ + wrappedRelZ
      }
    }

    if (railsRef.current) {
      railsRef.current.position.z = camZ
    }
  })

  const rows = useMemo(() => {
    return Array.from({ length: CONFIG.ROWS }, (_, i) => ({
      index: i,
      zBase: -i * CONFIG.ROW_SPACING
    }))
  }, [])

  return (
    <group>
      {/* 4 continuous corner rails following camera */}
      <group ref={railsRef}>
        <lineSegments geometry={railGeometry}>
          <lineBasicMaterial
            color={isDark ? '#2e2e3a' : '#94a3b8'}
            transparent
            opacity={isDark ? 0.6 : 0.75}
          />
        </lineSegments>
      </group>

      {/* 28 continuous seamlessly wrapped rows */}
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
    </group>
  )
}