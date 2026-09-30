'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/lib/theme'
import type * as ThreeNS from 'three'

/**
 * FULL 3D World Background v2 — "Web3 Metaverse Layer"
 *
 * Layer WebGL global untuk SELURUH situs (kedua tema), dibangun dengan three.js:
 *  1. Fleet geometri kaca faceted yang melayang (warisan v1)
 *  2. Blockchain constellation network — node + garis koneksi dinamis
 *  3. Holo-core centerpiece — torus knot holografik di belakang hero,
 *     bereaksi terhadap gerakan mouse
 *  4. Orbiters — titik cahaya yang mengorbit pada jalur elips miring
 *  5. Camera journey — kamera "berjalan" menembus dunia 3D saat halaman
 *     di-scroll (dolly + rise + roll halus)
 *
 * Performance-first (tidak boleh mengganggu situs produksi di Vercel):
 *  - `three` di-import dinamis (di luar bundle JS awal → SEO/LCP aman)
 *  - kualitas menyesuaikan perangkat (jumlah objek/partikel/DPR/antialias)
 *  - animasi berhenti saat tab tersembunyi
 *  - menghormati `prefers-reduced-motion` (render satu frame statis)
 *  - pergantian tema memperbarui warna/pencahayaan DI TEMPAT (tanpa flicker)
 *  - disposal penuh semua resource GPU saat unmount
 */
export function WebGL3DBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const hostRef = useRef<HTMLDivElement>(null)
  const themeRef = useRef(theme)
  const applyThemeRef = useRef<((isLight: boolean) => void) | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    themeRef.current = theme
    // Update the live scene in place when the theme flips (no rebuild flicker)
    applyThemeRef.current?.(theme === 'light')
  }, [theme])

  useEffect(() => {
    if (!mounted) return

    const host = hostRef.current
    if (!host) return

    let disposed = false
    let cleanup: (() => void) | undefined

    // Reduced motion → we still render one beautiful static frame (no RAF loop)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile =
      window.matchMedia('(max-width: 768px)').matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4

    const start = async () => {
      const THREE = await import('three')
      if (disposed || !hostRef.current) return

      /* ---------- palette (theme aware, read from CSS vars) ---------- */
      const readVar = (name: string, fallback: string) => {
        const v = getComputedStyle(document.documentElement).getPropertyValue(name)?.trim()
        return v && v.startsWith('#') ? v : fallback
      }

      /* ---------- renderer ---------- */
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance',
      })
      renderer.setClearColor(0x000000, 0)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 1.75))
      renderer.setSize(window.innerWidth, window.innerHeight)
      hostRef.current.appendChild(renderer.domElement)
      renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;'

      /* ---------- scene & camera ---------- */
      const scene = new THREE.Scene()
      const fog = new THREE.FogExp2(0x0a0a0f, 0.013)
      scene.fog = fog

      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 120)
      camera.position.set(0, 0, 26)

      /* ---------- lights (soft, glassy, colorful) ---------- */
      const ambient = new THREE.AmbientLight(0xffffff, 0.35)
      scene.add(ambient)

      const keyLight = new THREE.PointLight(0x00f5ff, 260, 90)
      keyLight.position.set(-14, 8, 16)
      scene.add(keyLight)

      const fillLight = new THREE.PointLight(0xff00aa, 200, 90)
      fillLight.position.set(16, -6, 12)
      scene.add(fillLight)

      const rimLight = new THREE.PointLight(0x8b5cf6, 180, 90)
      rimLight.position.set(4, 12, -8)
      scene.add(rimLight)

      /* ---------- 1. floating geometry fleet ---------- */
      const group = new THREE.Group()
      scene.add(group)

      type FloatingMesh = {
        mesh: ThreeNS.Mesh
        paletteIndex: number
        baseOpacity: number
        isShell: boolean
        spin: { x: number; y: number; z: number }
        floatAmp: number
        floatSpeed: number
        phase: number
        baseY: number
      }
      const fleet: FloatingMesh[] = []
      const disposables: Array<{ dispose: () => void }> = []

      const shapeKinds = isMobile
        ? ['ico', 'oct', 'torus'] as const
        : ['ico', 'oct', 'torus', 'knot', 'sphere'] as const

      const COUNT = isMobile ? 7 : 13

      const rand = (min: number, max: number) => min + Math.random() * (max - min)

      for (let i = 0; i < COUNT; i++) {
        const kind = shapeKinds[i % shapeKinds.length]
        const scale = rand(0.85, isMobile ? 1.6 : 2.3)

        let geometry: ThreeNS.BufferGeometry
        switch (kind) {
          case 'ico':
            geometry = new THREE.IcosahedronGeometry(scale, 0)
            break
          case 'oct':
            geometry = new THREE.OctahedronGeometry(scale, 0)
            break
          case 'torus':
            geometry = new THREE.TorusGeometry(scale * 0.8, scale * 0.32, 12, 36)
            break
          case 'knot':
            geometry = new THREE.TorusKnotGeometry(scale * 0.62, scale * 0.2, 90, 12)
            break
          default:
            geometry = new THREE.SphereGeometry(scale, 24, 24)
        }
        disposables.push(geometry)

        const material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          metalness: 0.35,
          roughness: 0.22,
          flatShading: kind !== 'sphere',
          transparent: true,
          side: THREE.DoubleSide,
        })
        disposables.push(material)

        const mesh = new THREE.Mesh(geometry, material)
        // Spread across the viewport with depth variation (keeps center clear
        // so the hero content stays readable)
        mesh.position.set(
          rand(-17, 17),
          rand(-8.5, 8.5),
          rand(-12, 3)
        )
        // Nudge away from the exact center — content lives there
        if (Math.abs(mesh.position.x) < 6 && Math.abs(mesh.position.y) < 4) {
          mesh.position.x += mesh.position.x >= 0 ? 7 : -7
        }
        mesh.rotation.set(rand(0, Math.PI), rand(0, Math.PI), rand(0, Math.PI))

        fleet.push({
          mesh,
          paletteIndex: i % 3,
          baseOpacity: kind === 'sphere' ? 0.14 : rand(0.42, 0.62),
          isShell: false,
          spin: { x: rand(0.05, 0.22), y: rand(0.05, 0.28), z: rand(0.02, 0.12) },
          floatAmp: rand(0.35, 0.95),
          floatSpeed: rand(0.25, 0.6),
          phase: rand(0, Math.PI * 2),
          baseY: mesh.position.y,
        })
        group.add(mesh)
      }

      /* ---------- hero containment shell (wireframe icosahedron) ---------- */
      if (!isMobile) {
        const shellGeometry = new THREE.IcosahedronGeometry(9, 1)
        const shellMaterial = new THREE.MeshBasicMaterial({
          color: 0x00f5ff,
          wireframe: true,
          transparent: true,
          opacity: 0.045,
        })
        disposables.push(shellGeometry, shellMaterial)
        const shell = new THREE.Mesh(shellGeometry, shellMaterial)
        shell.position.set(0, 0, -14)
        group.add(shell)
        fleet.push({
          mesh: shell,
          paletteIndex: 0,
          baseOpacity: 0.045,
          isShell: true,
          spin: { x: 0.02, y: 0.045, z: 0 },
          floatAmp: 0.4,
          floatSpeed: 0.18,
          phase: 0,
          baseY: 0,
        })
      }

      /* ---------- 2. HOLO-CORE centerpiece (hero backdrop) ----------
         Torus knot holografik besar di belakang konten hero.
         Rotasi otomatis + mengikuti mouse dengan lerp halus. */
      let holoCore: ThreeNS.Group | null = null
      let holoCoreMat: ThreeNS.MeshStandardMaterial | null = null
      let holoCoreWire: ThreeNS.MeshBasicMaterial | null = null
      if (!isMobile) {
        holoCore = new THREE.Group()
        holoCore.position.set(0, 0.4, -6.5)

        const coreGeometry = new THREE.TorusKnotGeometry(4.1, 1.05, 160, 20)
        holoCoreMat = new THREE.MeshStandardMaterial({
          color: 0x00f5ff,
          metalness: 0.55,
          roughness: 0.28,
          transparent: true,
          opacity: 0.14,
          emissive: 0x00f5ff,
          emissiveIntensity: 0.35,
        })
        const coreMesh = new THREE.Mesh(coreGeometry, holoCoreMat)
        disposables.push(coreGeometry, holoCoreMat)
        holoCore.add(coreMesh)

        const wireGeometry = new THREE.TorusKnotGeometry(5.6, 0.12, 120, 14)
        holoCoreWire = new THREE.MeshBasicMaterial({
          color: 0xff00aa,
          wireframe: true,
          transparent: true,
          opacity: 0.07,
        })
        const wireMesh = new THREE.Mesh(wireGeometry, holoCoreWire)
        disposables.push(wireGeometry, holoCoreWire)
        holoCore.add(wireMesh)

        scene.add(holoCore)
      }

      /* ---------- 3. BLOCKCHAIN CONSTELLATION NETWORK ----------
         Node bercahaya + garis koneksi — sinyatur visual Web3.
         Rotasi lambat sebagai satu kesatuan, plus pulse opacity. */
      const network = new THREE.Group()
      scene.add(network)

      const NODES = isMobile ? 14 : 26
      const nodePositions: ThreeNS.Vector3[] = []
      for (let i = 0; i < NODES; i++) {
        nodePositions.push(
          new THREE.Vector3(rand(-20, 20), rand(-12, 12), rand(-30, -5))
        )
      }

      // Node points (glowing dots)
      const nodeGeo = new THREE.BufferGeometry()
      const nodePosArr = new Float32Array(NODES * 3)
      nodePositions.forEach((v, i) => {
        nodePosArr[i * 3] = v.x
        nodePosArr[i * 3 + 1] = v.y
        nodePosArr[i * 3 + 2] = v.z
      })
      nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePosArr, 3))
      const nodeMat = new THREE.PointsMaterial({
        size: 0.32,
        color: 0x00f5ff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      })
      disposables.push(nodeGeo, nodeMat)
      network.add(new THREE.Points(nodeGeo, nodeMat))

      // Edges: connect nodes within a threshold distance
      const edgePairs: Array<[ThreeNS.Vector3, ThreeNS.Vector3]> = []
      const LINK_DIST = 11.5
      for (let i = 0; i < NODES; i++) {
        for (let j = i + 1; j < NODES; j++) {
          if (nodePositions[i]!.distanceTo(nodePositions[j]!) < LINK_DIST) {
            edgePairs.push([nodePositions[i]!, nodePositions[j]!])
          }
        }
      }
      const edgeGeo = new THREE.BufferGeometry()
      const edgePosArr = new Float32Array(edgePairs.length * 6)
      edgePairs.forEach(([a, b], i) => {
        edgePosArr[i * 6] = a.x
        edgePosArr[i * 6 + 1] = a.y
        edgePosArr[i * 6 + 2] = a.z
        edgePosArr[i * 6 + 3] = b.x
        edgePosArr[i * 6 + 4] = b.y
        edgePosArr[i * 6 + 5] = b.z
      })
      edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePosArr, 3))
      const edgeMat = new THREE.LineBasicMaterial({
        color: 0x00f5ff,
        transparent: true,
        opacity: 0.14,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      disposables.push(edgeGeo, edgeMat)
      network.add(new THREE.LineSegments(edgeGeo, edgeMat))

      /* ---------- particle field ---------- */
      const PARTICLES = isMobile ? 320 : 750
      const positions = new Float32Array(PARTICLES * 3)
      const colors = new Float32Array(PARTICLES * 3)

      for (let i = 0; i < PARTICLES; i++) {
        positions[i * 3] = rand(-34, 34)
        positions[i * 3 + 1] = rand(-20, 20)
        positions[i * 3 + 2] = rand(-28, 8)
        colors[i * 3] = 1
        colors[i * 3 + 1] = 1
        colors[i * 3 + 2] = 1
      }

      const particleGeometry = new THREE.BufferGeometry()
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      disposables.push(particleGeometry)

      const particleMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.09 : 0.075,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      })
      disposables.push(particleMaterial)

      const particles = new THREE.Points(particleGeometry, particleMaterial)
      scene.add(particles)

      /* ---------- 4. ORBITERS — cahaya yang mengorbit (jalur elips miring) ---------- */
      const ORBITERS = isMobile ? 3 : 6
      const orbiterGeo = new THREE.BufferGeometry()
      const orbiterPosArr = new Float32Array(ORBITERS * 3)
      orbiterGeo.setAttribute('position', new THREE.BufferAttribute(orbiterPosArr, 3))
      const orbiterMat = new THREE.PointsMaterial({
        size: 0.5,
        color: 0xff00aa,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      })
      disposables.push(orbiterGeo, orbiterMat)
      const orbiters = new THREE.Points(orbiterGeo, orbiterMat)
      scene.add(orbiters)

      const orbiterParams = Array.from({ length: ORBITERS }, (_, i) => ({
        radius: 7 + (i % 3) * 2.6,
        speed: 0.12 + (i % 4) * 0.05,
        phase: (i / ORBITERS) * Math.PI * 2,
        tiltX: (i % 2 === 0 ? 1 : -1) * (0.4 + (i % 3) * 0.25),
        tiltZ: (i % 3 === 0 ? 1 : -1) * (0.3 + (i % 2) * 0.4),
        centerY: rand(-3, 5),
      }))

      /* ---------- in-place theme switching (no canvas rebuild) ---------- */
      const applyTheme = (isLight: boolean) => {
        const CYAN = readVar('--neon-cyan', isLight ? '#0080FF' : '#00F5FF')
        const MAGENTA = readVar('--neon-magenta', isLight ? '#CC0088' : '#FF00AA')
        const PURPLE = readVar('--neon-purple', isLight ? '#6D28D9' : '#8B5CF6')
        const palette = [CYAN, MAGENTA, PURPLE]

        // Atmosphere: deep space fog ↔ bright airy fog
        fog.color.set(isLight ? 0xeef2ff : 0x0a0a0f)
        fog.density = isLight ? 0.010 : 0.013

        // Lighting: airy & bright ↔ dramatic neon
        ambient.intensity = isLight ? 0.9 : 0.35
        keyLight.color.set(CYAN)
        keyLight.intensity = isLight ? 110 : 260
        fillLight.color.set(MAGENTA)
        fillLight.intensity = isLight ? 85 : 200
        rimLight.color.set(PURPLE)
        rimLight.intensity = isLight ? 75 : 180

        // Geometry fleet: pastel glass ↔ neon glass
        for (const item of fleet) {
          const material = item.mesh.material as ThreeNS.MeshStandardMaterial | ThreeNS.MeshBasicMaterial
          if (item.isShell) {
            const m = material as ThreeNS.MeshBasicMaterial
            m.color.set(CYAN)
            m.opacity = isLight ? 0.07 : 0.045
          } else {
            const m = material as ThreeNS.MeshStandardMaterial
            const color = new THREE.Color(palette[item.paletteIndex])
            m.color.set(color)
            m.emissive.set(color.clone().multiplyScalar(isLight ? 0.05 : 0.12))
            m.opacity = isLight ? item.baseOpacity * 0.8 : item.baseOpacity
            m.metalness = isLight ? 0.22 : 0.35
            m.roughness = isLight ? 0.34 : 0.22
            m.needsUpdate = true
          }
        }

        // Holo-core: cyan glass knot ↔ brighter pastel
        if (holoCoreMat && holoCoreWire) {
          const cyan = new THREE.Color(CYAN)
          holoCoreMat.color.set(cyan)
          holoCoreMat.emissive.set(cyan)
          holoCoreMat.opacity = isLight ? 0.10 : 0.14
          holoCoreMat.needsUpdate = true
          holoCoreWire.color.set(MAGENTA)
          holoCoreWire.opacity = isLight ? 0.06 : 0.07
          holoCoreWire.needsUpdate = true
        }

        // Constellation network
        nodeMat.color.set(isLight ? new THREE.Color(CYAN).multiplyScalar(0.9) : CYAN)
        nodeMat.opacity = isLight ? 0.65 : 0.85
        nodeMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending
        nodeMat.needsUpdate = true
        edgeMat.color.set(isLight ? new THREE.Color(PURPLE).lerp(new THREE.Color(CYAN), 0.4) : CYAN)
        edgeMat.opacity = isLight ? 0.16 : 0.14
        edgeMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending
        edgeMat.needsUpdate = true

        // Orbiters: magenta ↔ deeper pink on light
        orbiterMat.color.set(isLight ? new THREE.Color(MAGENTA).multiplyScalar(0.9) : MAGENTA)
        orbiterMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending
        orbiterMat.opacity = isLight ? 0.7 : 0.9
        orbiterMat.needsUpdate = true

        // Particles: additive glow only works on dark — switch to normal
        // blending on light so the field stays visible
        particleMaterial.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending
        particleMaterial.opacity = isLight ? 0.5 : 0.75
        particleMaterial.needsUpdate = true

        const cCyan = new THREE.Color(CYAN)
        const cMagenta = new THREE.Color(MAGENTA)
        const cPurple = new THREE.Color(PURPLE)
        const particlePalette = [cCyan, cMagenta, cPurple]
        if (isLight) {
          // Slightly deepen colors so they read on a bright background
          for (const c of particlePalette) c.multiplyScalar(0.82)
        }
        for (let i = 0; i < PARTICLES; i++) {
          const c = particlePalette[i % 3]
          colors[i * 3] = c.r
          colors[i * 3 + 1] = c.g
          colors[i * 3 + 2] = c.b
        }
        particleGeometry.getAttribute('color').needsUpdate = true
      }

      applyThemeRef.current = applyTheme
      applyTheme(themeRef.current === 'light')

      /* ---------- interaction state ---------- */
      const mouse = { x: 0, y: 0 }
      const smooth = { x: 0, y: 0 }

      const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
      }

      let targetScrollY = window.scrollY
      const onScroll = () => {
        targetScrollY = window.scrollY
      }

      let resizeTimer: ReturnType<typeof setTimeout> | undefined
      const onResize = () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
        }, 120)
      }

      window.addEventListener('mousemove', onMouseMove, { passive: true })
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize)

      /* ---------- animation loop (camera journey + living network) ---------- */
      const clock = new THREE.Clock()
      let raf = 0
      let running = true

      const tick = () => {
        if (!running) return
        const t = clock.getElapsedTime()

        // geometry: individual spin + gentle bob
        for (const item of fleet) {
          item.mesh.rotation.x += item.spin.x * 0.01
          item.mesh.rotation.y += item.spin.y * 0.01
          item.mesh.rotation.z += item.spin.z * 0.01
          item.mesh.position.y = item.baseY + Math.sin(t * item.floatSpeed + item.phase) * item.floatAmp
        }

        // holo-core: auto rotate + mouse-follow (lerp for buttery motion)
        if (holoCore) {
          holoCore.rotation.y += 0.0022
          holoCore.rotation.x += (smooth.y * 0.35 - holoCore.rotation.x) * 0.02
          holoCore.rotation.z = Math.sin(t * 0.1) * 0.08
        }

        // constellation network: slow group rotation + soft opacity pulse
        network.rotation.y = t * 0.008
        network.rotation.x = Math.sin(t * 0.04) * 0.05
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.8)
        edgeMat.opacity = (themeRef.current === 'light' ? 0.10 : 0.09) + pulse * 0.07

        // orbiters: parametric elliptical paths (tilted)
        for (let i = 0; i < ORBITERS; i++) {
          const p = orbiterParams[i]!
          const a = t * p.speed + p.phase
          let x = Math.cos(a) * p.radius
          let y = Math.sin(a) * p.radius * 0.42
          let z = Math.sin(a) * p.radius * 0.3
          // tilt around X then Z
          const y1 = y * Math.cos(p.tiltX) - z * Math.sin(p.tiltX)
          const z1 = y * Math.sin(p.tiltX) + z * Math.cos(p.tiltX)
          const x2 = x * Math.cos(p.tiltZ) - z1 * Math.sin(p.tiltZ)
          const z2 = x * Math.sin(p.tiltZ) + z1 * Math.cos(p.tiltZ)
          orbiterPosArr[i * 3] = x2
          orbiterPosArr[i * 3 + 1] = y1 + p.centerY
          orbiterPosArr[i * 3 + 2] = z2 - 12
        }
        orbiterGeo.getAttribute('position').needsUpdate = true

        // particle drift
        particles.rotation.y = t * 0.012
        particles.rotation.x = Math.sin(t * 0.05) * 0.04

        // gentle whole-group sway for parallax depth
        group.rotation.y = Math.sin(t * 0.05) * 0.05

        // CAMERA JOURNEY: scroll = berjalan menembus dunia 3D.
        // journey 0 (hero) → 1 (footer): dolly maju + naik + roll halus.
        const docH = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
        const journey = Math.min(targetScrollY / docH, 1)

        smooth.x += (mouse.x - smooth.x) * 0.045
        smooth.y += (mouse.y - smooth.y) * 0.045

        camera.position.x = smooth.x * 2.4
        camera.position.y = -smooth.y * 1.5 + journey * 5.5
        camera.position.z = 26 - journey * 7
        camera.rotation.z = Math.sin(journey * Math.PI * 2) * 0.028
        camera.lookAt(0, journey * 3.4, -4)

        renderer.render(scene, camera)
        raf = requestAnimationFrame(tick)
      }

      if (prefersReduced) {
        // Static, still beautiful: one composed frame, no continuous loop
        camera.position.set(0, 0, 26)
        camera.lookAt(0, 0, 0)
        renderer.render(scene, camera)
      } else {
        raf = requestAnimationFrame(tick)
      }

      const onVisibility = () => {
        if (prefersReduced) return
        if (document.hidden) {
          running = false
          cancelAnimationFrame(raf)
        } else if (!running) {
          running = true
          clock.getDelta() // discard the gap
          raf = requestAnimationFrame(tick)
        }
      }
      document.addEventListener('visibilitychange', onVisibility)

      /* ---------- cleanup ---------- */
      cleanup = () => {
        applyThemeRef.current = null
        running = false
        cancelAnimationFrame(raf)
        clearTimeout(resizeTimer)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
        document.removeEventListener('visibilitychange', onVisibility)
        for (const d of disposables) d.dispose()
        renderer.dispose()
        const hostEl = hostRef.current
        if (hostEl && renderer.domElement.parentNode === hostEl) {
          hostEl.removeChild(renderer.domElement)
        }
      }
    }

    start()

    return () => {
      disposed = true
      cleanup?.()
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 1 }}
    />
  )
}
