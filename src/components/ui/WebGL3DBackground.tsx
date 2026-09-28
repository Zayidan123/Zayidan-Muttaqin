'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/lib/theme'
import type * as ThreeNS from 'three'

/**
 * Modern 3D WebGL Background — floating faceted glass geometry + additive
 * particle field with mouse & scroll parallax, built with three.js.
 *
 * Performance-first design:
 *  - `three` is dynamically imported (kept out of the initial JS bundle → better SEO/LCP)
 *  - quality adapts to the device (object count, particle count, DPR, antialias)
 *  - animation pauses when the tab is hidden
 *  - honors `prefers-reduced-motion` (renders a single static frame)
 *  - full GPU resource disposal on unmount
 *
 * The palette is read from CSS custom properties (--neon-cyan, --neon-magenta,
 * --neon-purple) so it stays in sync with the active theme / user presets.
 */
export function WebGL3DBackground() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // The WebGL scene is the signature layer of the modern-3D experience.
  // It is active on the default (dark) theme only — every other theme keeps
  // its own carefully crafted background untouched.
  const active = mounted && theme === 'dark'

  useEffect(() => {
    if (!active) return

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

      /* ---------- palette (theme aware) ---------- */
      const styles = getComputedStyle(document.documentElement)
      const readVar = (name: string, fallback: string) => {
        const v = styles.getPropertyValue(name)?.trim()
        return v && v.startsWith('#') ? v : fallback
      }
      const CYAN = readVar('--neon-cyan', '#00F5FF')
      const MAGENTA = readVar('--neon-magenta', '#FF00AA')
      const PURPLE = readVar('--neon-purple', '#8B5CF6')

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
      scene.fog = new THREE.FogExp2(0x0a0a0f, 0.016)

      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 120)
      camera.position.set(0, 0, 26)

      /* ---------- lights (soft, glassy, colorful) ---------- */
      scene.add(new THREE.AmbientLight(0xffffff, 0.35))

      const keyLight = new THREE.PointLight(new THREE.Color(CYAN), 260, 90)
      keyLight.position.set(-14, 8, 16)
      scene.add(keyLight)

      const fillLight = new THREE.PointLight(new THREE.Color(MAGENTA), 200, 90)
      fillLight.position.set(16, -6, 12)
      scene.add(fillLight)

      const rimLight = new THREE.PointLight(new THREE.Color(PURPLE), 180, 90)
      rimLight.position.set(4, 12, -8)
      scene.add(rimLight)

      /* ---------- floating geometry fleet ---------- */
      const group = new THREE.Group()
      scene.add(group)

      type FloatingMesh = {
        mesh: ThreeNS.Mesh
        spin: { x: number; y: number; z: number }
        floatAmp: number
        floatSpeed: number
        phase: number
        baseY: number
      }
      const fleet: FloatingMesh[] = []
      const disposables: Array<{ dispose: () => void }> = []

      const palette = [CYAN, MAGENTA, PURPLE]

      const shapeKinds = isMobile
        ? ['ico', 'oct', 'torus'] as const
        : ['ico', 'oct', 'torus', 'knot', 'sphere'] as const

      const COUNT = isMobile ? 7 : 13

      const rand = (min: number, max: number) => min + Math.random() * (max - min)

      for (let i = 0; i < COUNT; i++) {
        const kind = shapeKinds[i % shapeKinds.length]
        const color = new THREE.Color(palette[i % palette.length])
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
          color: color,
          emissive: color.clone().multiplyScalar(0.12),
          metalness: 0.35,
          roughness: 0.22,
          flatShading: kind !== 'sphere',
          transparent: true,
          opacity: kind === 'sphere' ? 0.14 : rand(0.42, 0.62),
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
          color: new THREE.Color(CYAN),
          wireframe: true,
          transparent: true,
          opacity: 0.045,
        })
        disposables.push(shellGeometry, shellMaterial)
        const shell = new THREE.Mesh(shellGeometry, shellMaterial)
        shell.position.set(0, 0, -14)
        group.add(shell)
        ;(shell as ThreeNS.Mesh & { __isShell?: boolean }).__isShell = true
        fleet.push({
          mesh: shell,
          spin: { x: 0.02, y: 0.045, z: 0 },
          floatAmp: 0.4,
          floatSpeed: 0.18,
          phase: 0,
          baseY: 0,
        })
      }

      /* ---------- additive particle field ---------- */
      const PARTICLES = isMobile ? 320 : 750
      const positions = new Float32Array(PARTICLES * 3)
      const colors = new Float32Array(PARTICLES * 3)
      const cCyan = new THREE.Color(CYAN)
      const cMagenta = new THREE.Color(MAGENTA)
      const cPurple = new THREE.Color(PURPLE)

      for (let i = 0; i < PARTICLES; i++) {
        positions[i * 3] = rand(-34, 34)
        positions[i * 3 + 1] = rand(-20, 20)
        positions[i * 3 + 2] = rand(-28, 8)
        const c = [cCyan, cMagenta, cPurple][i % 3]
        colors[i * 3] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
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
  }, [active])

  if (!mounted) return null

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        opacity: active ? 1 : 0,
        transition: 'opacity 0.6s ease',
        visibility: active ? 'visible' : 'hidden',
      }}
    />
  )
}
