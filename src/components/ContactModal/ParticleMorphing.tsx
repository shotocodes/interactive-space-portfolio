// components/ContactModal/ParticleMorphing.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleMorphingProps {
  morphToRing: boolean;
  warpMode?: boolean;
  magneticMode?: boolean;
  particleCount?: number;
}

export default function ParticleMorphing({
  morphToRing,
  warpMode = false,
  magneticMode = false,
  particleCount = 15000
}: ParticleMorphingProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const morphProgressRef = useRef(0);
  const targetMorphRef = useRef(morphToRing ? 1 : 0);
  const warpModeRef = useRef(warpMode);
  const magneticModeRef = useRef(magneticMode);

  useEffect(() => {
    warpModeRef.current = warpMode;
  }, [warpMode]);

  useEffect(() => {
    magneticModeRef.current = magneticMode;
  }, [magneticMode]);

  useEffect(() => {
    targetMorphRef.current = morphToRing ? 1 : 0;
  }, [morphToRing]);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 円錐の座標生成
    const conePositions = new Float32Array(particleCount * 3);
    const height = 2.8;
    const baseRadius = 1.3;

    for (let i = 0; i < particleCount; i++) {
      let x, y, z;
      const type = Math.random();

      if (type < 0.7) {
        // 70%: 円錐の側面
        const heightRatio = Math.random();
        const angle = Math.random() * Math.PI * 2;
        const currentRadius = baseRadius * (1 - heightRatio);

        x = Math.cos(angle) * currentRadius;
        y = -height / 2 + heightRatio * height;
        z = Math.sin(angle) * currentRadius;
      } else {
        // 30%: 底面
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * baseRadius;

        x = Math.cos(angle) * radius;
        y = -height / 2;
        z = Math.sin(angle) * radius;
      }

      conePositions[i * 3] = x;
      conePositions[i * 3 + 1] = y;
      conePositions[i * 3 + 2] = z;
    }

    // リングの座標生成
    const ringPositions = new Float32Array(particleCount * 3);
    const majorRadius = 1.2;
    const minorRadius = 0.25;

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;

      const x = (majorRadius + minorRadius * Math.cos(phi)) * Math.cos(theta);
      const y = minorRadius * Math.sin(phi);
      const z = (majorRadius + minorRadius * Math.cos(phi)) * Math.sin(theta);

      ringPositions[i * 3] = x;
      ringPositions[i * 3 + 1] = y;
      ringPositions[i * 3 + 2] = z;
    }

    const currentPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      currentPositions[i] = conePositions[i];
    }

    const sizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      sizes[i] = 0.015 + Math.random() * 0.025;
    }

    let mouseNormalizedX = 0;
    let mouseNormalizedY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseNormalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNormalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mousePos: { value: new THREE.Vector2(0, 0) },
        warpMode: { value: warpMode ? 1.0 : 0.0 },
        magneticMode: { value: magneticMode ? 1.0 : 0.0 }
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        uniform vec2 mousePos;
        uniform float warpMode;
        uniform float magneticMode;

        void main() {
          vec3 pos = position;

          pos.x += sin(time * 0.5 + position.y * 2.0) * 0.008;
          pos.y += cos(time * 0.5 + position.z * 2.0) * 0.008;
          pos.z += sin(time * 0.5 + position.x * 2.0) * 0.008;

          if (warpMode > 0.0) {
            float warpStrength = warpMode * 0.5;
            float angle = atan(pos.z, pos.x);
            float wave = sin(angle * 3.0 + time * 2.0);
            pos.x *= 1.0 + wave * warpStrength * 0.2;
            pos.y += wave * warpStrength * 0.5;
            pos.z *= 1.0 + wave * warpStrength * 0.2;
          }

          if (magneticMode > 0.0) {
            vec3 mousePos3D = vec3(mousePos * 6.0, 0.0);
            vec3 toMouse = mousePos3D - pos;
            float distance = length(toMouse);
            if (distance < 8.0) {
              float pull = (8.0 - distance) / 8.0;
              pos += normalize(toMouse) * pull * magneticMode * 0.6;
            }
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float r = length(center);
          if (r > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.0, 0.5, r);
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.9);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: true,
    });

    materialRef.current = material;

    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    scene.add(particles);

    let time = 0;
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.008;

      // モーフィング
      const morphSpeed = 0.03;
      if (Math.abs(morphProgressRef.current - targetMorphRef.current) > 0.001) {
        if (morphProgressRef.current < targetMorphRef.current) {
          morphProgressRef.current = Math.min(morphProgressRef.current + morphSpeed, targetMorphRef.current);
        } else {
          morphProgressRef.current = Math.max(morphProgressRef.current - morphSpeed, targetMorphRef.current);
        }

        const positions = geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          positions[i3] = conePositions[i3] + (ringPositions[i3] - conePositions[i3]) * morphProgressRef.current;
          positions[i3 + 1] = conePositions[i3 + 1] + (ringPositions[i3 + 1] - conePositions[i3 + 1]) * morphProgressRef.current;
          positions[i3 + 2] = conePositions[i3 + 2] + (ringPositions[i3 + 2] - conePositions[i3 + 2]) * morphProgressRef.current;
        }
        geometry.attributes.position.needsUpdate = true;
      }

      particles.rotation.y += 0.003;
      particles.rotation.x = Math.sin(time * 0.2) * 0.2;

      material.uniforms.time.value = time;
      material.uniforms.mousePos.value.set(mouseNormalizedX, mouseNormalizedY);
      material.uniforms.warpMode.value = warpModeRef.current ? 1.0 : 0.0;
      material.uniforms.magneticMode.value = magneticModeRef.current ? 1.0 : 0.0;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [particleCount]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
}
