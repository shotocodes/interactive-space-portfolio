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

    // 現在のモーフ状態を保存
    const savedMorphProgress = morphProgressRef.current;

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
        z = Math.sin(angle) * currentRadius;
        y = (heightRatio - 0.5) * height;
      } else {
        // 30%: 円錐の底面
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * baseRadius;

        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
        y = -height / 2;
      }

      conePositions[i * 3] = x;
      conePositions[i * 3 + 1] = y;
      conePositions[i * 3 + 2] = z;
    }

    // リングの座標生成
    const ringPositions = new Float32Array(particleCount * 3);
    const outerRadius = 1.8;
    const innerRadius = 1.2;
    const ringThickness = 0.15;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * ringThickness;

      ringPositions[i * 3] = x;
      ringPositions[i * 3 + 1] = y;
      ringPositions[i * 3 + 2] = z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(conePositions, 3));
    geometry.setAttribute('targetPosition', new THREE.BufferAttribute(ringPositions, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        morphProgress: { value: savedMorphProgress }, // 保存した状態を復元
        time: { value: 0 },
        warpMode: { value: warpModeRef.current ? 1.0 : 0.0 },
        magneticMode: { value: magneticModeRef.current ? 1.0 : 0.0 },
        mousePos: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: `
        uniform float morphProgress;
        uniform float time;
        uniform float warpMode;
        uniform float magneticMode;
        uniform vec2 mousePos;
        attribute vec3 targetPosition;
        varying vec3 vColor;

        void main() {
          vec3 pos = mix(position, targetPosition, morphProgress);

          if (warpMode > 0.5) {
            float warpAmount = sin(pos.y * 2.0 + time) * 0.3;
            pos.x += warpAmount;
          }

          if (magneticMode > 0.5) {
            vec2 toMouse = mousePos - pos.xy;
            float dist = length(toMouse);
            float pullStrength = 0.3 / (dist + 1.0);
            pos.xy += toMouse * pullStrength;
          }

          float colorMix = morphProgress;
          vColor = mix(
            vec3(0.8, 0.3, 0.9),
            vec3(1.0, 0.8, 0.3),
            colorMix
          );

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 2.0 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;

        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;

          float alpha = 1.0 - (dist * 2.0);
          gl_FragColor = vec4(vColor, alpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    particlesRef.current = particles;
    materialRef.current = material;

    // モーフ状態を復元
    morphProgressRef.current = savedMorphProgress;

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      material.uniforms.time.value = elapsed;
      material.uniforms.warpMode.value = warpModeRef.current ? 1.0 : 0.0;
      material.uniforms.magneticMode.value = magneticModeRef.current ? 1.0 : 0.0;

      const target = targetMorphRef.current;
      const current = morphProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.001) {
        morphProgressRef.current += diff * 0.02;
        material.uniforms.morphProgress.value = morphProgressRef.current;
      }

      particles.rotation.y = elapsed * 0.12;
      particles.rotation.x = Math.sin(elapsed * 0.06) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
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
