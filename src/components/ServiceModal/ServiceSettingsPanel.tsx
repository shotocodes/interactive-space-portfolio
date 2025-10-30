// components/ServiceModal/ParticleMorphing.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleMorphingProps {
  morphToPyramid: boolean;
  warpMode?: boolean;
  magneticMode?: boolean;
  particleCount?: number;
}

export default function ParticleMorphing({
  morphToPyramid,
  warpMode = false,
  magneticMode = false,
  particleCount = 15000
}: ParticleMorphingProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const morphProgressRef = useRef(0);
  const targetMorphRef = useRef(morphToPyramid ? 1 : 0);
  const warpModeRef = useRef(warpMode);
  const magneticModeRef = useRef(magneticMode);

  useEffect(() => {
    warpModeRef.current = warpMode;
  }, [warpMode]);

  useEffect(() => {
    magneticModeRef.current = magneticMode;
  }, [magneticMode]);

  useEffect(() => {
    targetMorphRef.current = morphToPyramid ? 1 : 0;
  }, [morphToPyramid]);

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

    // 立方体の座標生成
    const boxPositions = new Float32Array(particleCount * 3);
    const boxSize = 1.0;

    for (let i = 0; i < particleCount; i++) {
      const face = Math.floor(Math.random() * 6);
      let x, y, z;

      switch (face) {
        case 0: // 前面
          x = (Math.random() - 0.5) * boxSize * 2;
          y = (Math.random() - 0.5) * boxSize * 2;
          z = boxSize;
          break;
        case 1: // 背面
          x = (Math.random() - 0.5) * boxSize * 2;
          y = (Math.random() - 0.5) * boxSize * 2;
          z = -boxSize;
          break;
        case 2: // 上面
          x = (Math.random() - 0.5) * boxSize * 2;
          y = boxSize;
          z = (Math.random() - 0.5) * boxSize * 2;
          break;
        case 3: // 下面
          x = (Math.random() - 0.5) * boxSize * 2;
          y = -boxSize;
          z = (Math.random() - 0.5) * boxSize * 2;
          break;
        case 4: // 右面
          x = boxSize;
          y = (Math.random() - 0.5) * boxSize * 2;
          z = (Math.random() - 0.5) * boxSize * 2;
          break;
        case 5: // 左面
          x = -boxSize;
          y = (Math.random() - 0.5) * boxSize * 2;
          z = (Math.random() - 0.5) * boxSize * 2;
          break;
        default:
          x = y = z = 0;
      }

      boxPositions[i * 3] = x;
      boxPositions[i * 3 + 1] = y;
      boxPositions[i * 3 + 2] = z;
    }

    // ピラミッドの座標生成
    const pyramidPositions = new Float32Array(particleCount * 3);
    const pyramidSize = 1.5;
    const pyramidHeight = 2.0;

    for (let i = 0; i < particleCount; i++) {
      const level = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const radius = (1 - level) * pyramidSize;

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (level - 0.5) * pyramidHeight;

      pyramidPositions[i * 3] = x;
      pyramidPositions[i * 3 + 1] = y;
      pyramidPositions[i * 3 + 2] = z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(boxPositions, 3));
    geometry.setAttribute('targetPosition', new THREE.BufferAttribute(pyramidPositions, 3));

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
            float warpAmount = sin(pos.z * 2.0 + time) * 0.3;
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
            vec3(0.2, 0.8, 0.4),
            vec3(1.0, 0.6, 0.2),
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

      particles.rotation.y = elapsed * 0.15;
      particles.rotation.x = Math.sin(elapsed * 0.05) * 0.1;

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
