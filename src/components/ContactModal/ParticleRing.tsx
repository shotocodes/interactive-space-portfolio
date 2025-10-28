// components/ContactModal/ParticleRing.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleRingProps {
  warpMode?: boolean;
  magneticMode?: boolean;
  particleCount?: number;
}

export default function ParticleRing({
  warpMode = false,
  magneticMode = false,
  particleCount = 15000
}: ParticleRingProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const warpModeRef = useRef(warpMode);
  const magneticModeRef = useRef(magneticMode);

  useEffect(() => {
    warpModeRef.current = warpMode;
  }, [warpMode]);

  useEffect(() => {
    magneticModeRef.current = magneticMode;
  }, [magneticMode]);

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

    // リングの座標を生成
    const currentPositions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    let mouseNormalizedX = 0;
    let mouseNormalizedY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseNormalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNormalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // リングのパラメータ
    const majorRadius = 1.2; // メインの円の半径
    const minorRadius = 0.25; // チューブの太さ（ドーナツより細く、リングより太め）

    // 粒子を配置
    for (let i = 0; i < particleCount; i++) {
      // メイン円周上の角度
      const theta = Math.random() * Math.PI * 2;

      // チューブ断面の角度
      const phi = Math.random() * Math.PI * 2;

      // トーラスの式を使用
      const x = (majorRadius + minorRadius * Math.cos(phi)) * Math.cos(theta);
      const y = minorRadius * Math.sin(phi);
      const z = (majorRadius + minorRadius * Math.cos(phi)) * Math.sin(theta);

      currentPositions[i * 3] = x;
      currentPositions[i * 3 + 1] = y;
      currentPositions[i * 3 + 2] = z;

      sizes[i] = 0.015 + Math.random() * 0.025;
    }

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

          // 基本の揺れ - リングらしい動き
          float angle = atan(pos.z, pos.x);
          pos.x += sin(time * 0.5 + angle * 2.0) * 0.01;
          pos.y += cos(time * 0.8 + angle * 3.0) * 0.01;
          pos.z += sin(time * 0.5 + angle * 2.0) * 0.01;

          // ワープモード - 波のような動き
          if (warpMode > 0.0) {
            float warpStrength = warpMode * 0.5;
            float wave = sin(angle * 3.0 + time * 2.0);
            pos.x *= 1.0 + wave * warpStrength * 0.2;
            pos.y += wave * warpStrength * 0.5;
            pos.z *= 1.0 + wave * warpStrength * 0.2;
          }

          // マグネティックモード
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
    scene.add(particles);

    let time = 0;
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.008;

      // リングを回転
      particles.rotation.y += 0.003;
      particles.rotation.x = Math.sin(time * 0.2) * 0.2; // ゆっくり揺れる

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
