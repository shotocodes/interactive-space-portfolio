// components/ProjectModal/ParticleMorphing.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleMorphingProps {
  morphToHelix: boolean;
  warpMode?: boolean;
  magneticMode?: boolean;
  particleCount?: number;
}

export default function ParticleMorphing({
  morphToHelix,
  warpMode = false,
  magneticMode = false,
  particleCount = 15000
}: ParticleMorphingProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const morphProgressRef = useRef(0);
  const targetMorphRef = useRef(morphToHelix ? 1 : 0);
  const warpModeRef = useRef(warpMode);
  const magneticModeRef = useRef(magneticMode);

  useEffect(() => {
    warpModeRef.current = warpMode;
  }, [warpMode]);

  useEffect(() => {
    magneticModeRef.current = magneticMode;
  }, [magneticMode]);

  useEffect(() => {
    targetMorphRef.current = morphToHelix ? 1 : 0;
  }, [morphToHelix]);

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
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // トーラスノットの座標生成 - 正しい(2,3)トーラスノット
    const torusKnotPositions = new Float32Array(particleCount * 3);
    const p = 2;
    const q = 3;

    for (let i = 0; i < particleCount; i++) {
      const u = (i / particleCount) * Math.PI * 2;

      // (p, q) トーラスノットの正しい式
      const cosPU = Math.cos(p * u);
      const sinPU = Math.sin(p * u);
      const cosQU = Math.cos(q * u);
      const sinQU = Math.sin(q * u);

      const r = cosPU + 2;

      const x = r * cosQU;
      const y = r * sinQU;
      const z = -sinPU;

      // チューブの太さ
      const tubeRadius = 0.3;
      const angle = Math.random() * Math.PI * 2;
      const tubeX = tubeRadius * Math.cos(angle);
      const tubeY = tubeRadius * Math.sin(angle);

      // 法線方向にチューブを配置
      const nx = -cosQU * cosPU;
      const ny = -sinQU * cosPU;
      const nz = -sinPU;

      torusKnotPositions[i * 3] = (x + nx * tubeX) * 0.6;
      torusKnotPositions[i * 3 + 1] = (y + ny * tubeX) * 0.6;
      torusKnotPositions[i * 3 + 2] = (z + nz * tubeX + tubeY) * 0.6;
    }

    // 螺旋の座標生成
    const helixPositions = new Float32Array(particleCount * 3);
    const radius = 0.8;
    const height = 4;
    const turns = 5;

    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * turns * Math.PI * 2;
      const y = ((i / particleCount) - 0.5) * height;
      const helix = Math.floor(Math.random() * 2);
      const angle = t + (helix * Math.PI);

      const spread = 0.1;
      const baseX = Math.cos(angle) * radius;
      const baseZ = Math.sin(angle) * radius;

      helixPositions[i * 3] = baseX + (Math.random() - 0.5) * spread;
      helixPositions[i * 3 + 1] = y;
      helixPositions[i * 3 + 2] = baseZ + (Math.random() - 0.5) * spread;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(torusKnotPositions, 3));
    geometry.setAttribute('targetPosition', new THREE.BufferAttribute(helixPositions, 3));

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
            float warpAmount = sin(pos.x * 2.0 + time) * 0.3;
            pos.y += warpAmount;
          }

          if (magneticMode > 0.5) {
            vec2 toMouse = mousePos - pos.xy;
            float dist = length(toMouse);
            float pullStrength = 0.3 / (dist + 1.0);
            pos.xy += toMouse * pullStrength;
          }

          float colorMix = morphProgress;
          vColor = mix(
            vec3(0.3, 0.6, 1.0),
            vec3(1.0, 0.4, 0.8),
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
          vec2 center = gl_PointCoord - vec0.5;
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

      particles.rotation.y = elapsed * 0.1;
      particles.rotation.x = Math.sin(elapsed * 0.05) * 0.2;

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
