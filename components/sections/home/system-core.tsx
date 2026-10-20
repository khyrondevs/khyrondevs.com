'use client'

import { useEffect, useRef } from 'react'
import { Renderer, Camera, Transform, Program, Mesh, Sphere, Torus, Cylinder } from 'ogl'
import { useReducedMotion } from '@/hooks/use-reduced-motion'

export function SystemCore() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current

    // Initialize Renderer with mobile DPR clamping for GPU fill-rate protection
    const isMobile = window.innerWidth < 768
    const maxDpr = isMobile ? 1.25 : 2.0
    const renderer = new Renderer({
      alpha: true,
      dpr: Math.min(window.devicePixelRatio, maxDpr),
      antialias: !isMobile,
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    container.appendChild(gl.canvas)

    const camera = new Camera(gl, { fov: 45 })
    camera.position.z = 8

    const scene = new Transform()

    // --- SHADERS ---
    const wireframeVertex = `
      attribute vec3 position;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;
      varying vec3 vPos;
      void main() {
        vPos = position;
        vec3 pos = position;
        pos.y += sin(pos.x * 2.0 + uTime) * 0.1;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `
    const wireframeFragment = `
      precision highp float;
      varying vec3 vPos;
      void main() {
        float alpha = max(0.1, 1.0 - (abs(vPos.z) / 4.0));
        gl_FragColor = vec4(0.23, 0.51, 0.96, alpha * 0.4);
      }
    `

    const solidVertex = `
      attribute vec3 position;
      attribute vec3 normal;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform mat3 normalMatrix;
      varying vec3 vNormal;
      varying vec3 vPos;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `
    const solidFragment = `
      precision highp float;
      varying vec3 vNormal;
      varying vec3 vPos;
      void main() {
        // Fresnel effect for glowing edges
        vec3 viewDir = vec3(0.0, 0.0, 1.0); 
        float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.0);
        
        vec3 coreColor = vec3(0.04, 0.07, 0.12);
        vec3 edgeColor = vec3(0.1, 0.8, 1.0); // Cyan
        
        vec3 finalColor = mix(coreColor, edgeColor, fresnel);
        gl_FragColor = vec4(finalColor, 0.9);
      }
    `

    const pointsVertex = `
      attribute vec3 position;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;
      varying float vIntensity;
      void main() {
        vec3 pos = position;
        float noise = sin(pos.x * 10.0 + uTime) * cos(pos.y * 10.0 + uTime);
        pos += normalize(pos) * noise * 0.2;
        vIntensity = (noise + 1.0) * 0.5;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = 1.5 + vIntensity * 2.0;
      }
    `
    const pointsFragment = `
      precision highp float;
      varying float vIntensity;
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, vIntensity * 0.8);
      }
    `

    // --- MESHES ---
    // Outer Architecture: Wireframe Cylinder
    const cylGeo = new Cylinder(gl, { radiusTop: 4, radiusBottom: 4, height: 8, radialSegments: 32, heightSegments: 16 })
    const cylProg = new Program(gl, {
      vertex: wireframeVertex,
      fragment: wireframeFragment,
      transparent: true,
      uniforms: { uTime: { value: 0 } },
      cullFace: false
    })
    const cylinder = new Mesh(gl, { geometry: cylGeo, program: cylProg, mode: gl.LINES })
    cylinder.setParent(scene)

    // Middle Ring: Solid Glowing Torus
    const torGeo = new Torus(gl, { radius: 2.5, tube: 0.4, radialSegments: 64, tubularSegments: 128 })
    const torProg = new Program(gl, {
      vertex: solidVertex,
      fragment: solidFragment,
      transparent: true,
      cullFace: false
    })
    const torus = new Mesh(gl, { geometry: torGeo, program: torProg })
    torus.rotation.x = Math.PI / 2
    torus.setParent(scene)

    // Inner Core: Pulsing Particle Sphere
    const sphGeo = new Sphere(gl, { radius: 1.5, widthSegments: 64, heightSegments: 64 })
    const sphProg = new Program(gl, {
      vertex: pointsVertex,
      fragment: pointsFragment,
      transparent: true,
      uniforms: { uTime: { value: 0 } }
    })
    
    const core = new Mesh(gl, { geometry: sphGeo, program: sphProg, mode: gl.POINTS })
    core.setParent(scene)

    // --- INTERACTION ---
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    function onMouseMove(e: MouseEvent) {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1
        mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1
      }
    }

    if (!reducedMotion) {
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('touchmove', onTouchMove, { passive: true })
      window.addEventListener('touchstart', onTouchMove, { passive: true })
    }

    // --- RENDER LOOP ---
    function resize() {
      renderer.setSize(container.clientWidth, container.clientHeight)
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height })
      
      // Shift scene to the right on desktop to balance with left-aligned typography
      if (window.innerWidth > 1024) {
        scene.position.x = 2.5
        scene.position.y = 0
      } else {
        scene.position.x = 0
        scene.position.y = 1.0 // Shift up slightly on mobile
      }
    }
    window.addEventListener('resize', resize, false)
    resize()

    let isVisible = true
    let animationId = 0

    function update(t: number) {
      if (!isVisible) {
        animationId = 0
        return
      }

      if (!reducedMotion) {
        animationId = requestAnimationFrame(update)
      }

      const time = t * 0.001

      // Ambient gyration ensures dynamic breathing even without pointer/touch interaction
      const ambientX = Math.sin(time * 0.7) * 0.22
      const ambientY = Math.cos(time * 0.5) * 0.16

      // Pointer & Touch interpolation
      targetX += (mouseX - targetX) * 0.05
      targetY += (mouseY - targetY) * 0.05

      // Scroll interpolation
      const scrollY = window.scrollY
      const scrollProgress = Math.min(scrollY / window.innerHeight, 1.0)

      // Dramatic scroll transformation:
      // Camera moves closer/through the system
      camera.position.z = 8 - (scrollProgress * 4)

      // The entire system tilts upward on scroll with organic gyration
      const targetSceneX = (targetY * 0.2) + ambientY + (scrollProgress * Math.PI / 4)

      // Parallax & Rotation with ambient horizontal gyration
      scene.rotation.x += (targetSceneX - scene.rotation.x) * 0.05
      scene.rotation.y += ((targetX * 0.2 + ambientX) - scene.rotation.y) * 0.05

      cylinder.rotation.y = time * 0.12 + scrollProgress
      cylinder.rotation.z = time * 0.06
      cylProg.uniforms.uTime.value = time + scrollProgress * 2.0

      torus.rotation.z = -time * 0.22
      torus.rotation.x = Math.PI / 2 + Math.sin(time * 0.6) * 0.22 + (scrollProgress * Math.PI / 2)

      core.rotation.y = time * 0.35 - (scrollProgress * 2.0)
      core.rotation.x = Math.sin(time * 0.4) * 0.12
      sphProg.uniforms.uTime.value = time + scrollProgress * 5.0

      renderer.render({ scene, camera })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible && !animationId && !reducedMotion) {
          animationId = requestAnimationFrame(update)
        }
      },
      { threshold: 0 }
    )
    observer.observe(container)

    animationId = requestAnimationFrame(update)

    return () => {
      observer.disconnect()
      if (animationId) cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchstart', onTouchMove)
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas)
      }
    }
  }, [reducedMotion])

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none opacity-[0.85] mix-blend-screen" />
  )
}
