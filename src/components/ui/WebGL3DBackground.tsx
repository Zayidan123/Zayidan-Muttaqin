'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/lib/theme'
import type * as ThreeNS from 'three'

/**
 * Modern 3D WebGL Background — floating faceted glass geometry + particle
 * field with mouse & scroll parallax, built with three.js.
 *
 * This is the signature 3D layer of the whole site and runs in BOTH themes:
 *  - Gelap (dark):  additive glow particles, neon point lights, deep fog
 *  - Terang (light): airy pastel glass, normal-blend particles, bright fog
 *
 * Performance-first design:
 *  - `three` is dynamically imported (kept out of the initial JS bundle → better SEO/LCP)
 *  - quality adapts to the device (object count, particle count, DPR, antialias)
 *  - animation pauses when the tab is hidden
 *  - honors `prefers-reduced-motion` (renders a single static frame)
 *  - theme switches update colors/lighting IN PLACE (no canvas rebuild → no flicker)
 *  - full GPU resource disposal on unmount
 *
 * The palette is read from CSS custom properties (--neon-cyan, --neon-magenta,
 * --neon-purple) so it stays in sync with the active theme.
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
      const fog = new THREE.FogExp2(0x0a0a0f, 0.016)
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

      /* ---------- floating geometry fleet ---------- */
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

      /* ---------- hero centerpiece: large wireframe icosahedron shell ---------- */
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

      /* ---------- in-place theme switching (no canvas rebuild) ---------- */
      const applyTheme = (isLight: boolean) => {
        const CYAN = readVar('--neon-cyan', isLight ? '#0080FF' : '#00F5FF')
        const MAGENTA = readVar('--neon-magenta', isLight ? '#CC0088' : '#FF00AA')
        const PURPLE = readVar('--neon-purple', isLight ? '#6D28D9' : '#8B5CF6')
        const palette = [CYAN, MAGENTA, PURPLE]

        // Atmosphere: deep space fog ↔ bright airy fog
        fog.color.set(isLight ? 0xeef2ff : 0x0a0a0f)

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

      /* ---------- animation loop ---------- */
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

        // particle drift
        particles.rotation.y = t * 0.012
        particles.rotation.x = Math.sin(t * 0.05) * 0.04

        // gentle whole-group sway for parallax depth
        group.rotation.y = Math.sin(t * 0.05) * 0.05

        // camera parallax: mouse + scroll (lerp for buttery motion)
        smooth.x += (mouse.x - smooth.x) * 0.045
        smooth.y += (mouse.y - smooth.y) * 0.045
        const scrollDrift = Math.min(targetScrollY / window.innerHeight, 3) * 1.6
        camera.position.x = smooth.x * 2.4
        camera.position.y = -smooth.y * 1.5 + scrollDrift
        camera.lookAt(0, scrollDrift * 0.55, 0)

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
