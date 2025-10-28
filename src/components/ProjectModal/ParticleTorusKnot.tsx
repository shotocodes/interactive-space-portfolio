// components/ProjectPage/ParticleTorusKnot.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleTorusKnotProps {
  warpMode?: boolean;
  magneticMode?: boolean;
  particleCount?: number;
}

export default function ParticleTorusKnot({
  warpMode = false,
  magneticMode = false,
  particleCount = 15000
}: ParticleTorusKnotProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const warpModeRef = useRef(warpMode);
  const magneticModeRef = useRef(magneticMode);

  // warpModeとmagneticModeの変更を追跡
  useEffect(() => {
    warpModeRef.current = warpMode;
  }, [warpMode]);

  useEffect(() => {
    magneticModeRef.current = magneticMode;
  }, [magneticMode]);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;

    // 既存のcanvasをクリア
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // シーン、カメラ、レンダラーのセットアップ
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

    // トーラスノットの座標を生成
    const torusKnotGeometry = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 16);
    const torusKnotPositions = torusKnotGeometry.attributes.position.array;
    const torusKnotVertexCount = torusKnotPositions.length / 3;

    const currentPositions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // マウストラッキング用
    let mouseNormalizedX = 0;
    let mouseNormalizedY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseNormalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNormalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // トーラスノットの周辺に粒子を配置
    for (let i = 0; i < particleCount; i++) {
      const randomVertexIndex = Math.floor(Math.random() * torusKnotVertexCount) * 3;
      const baseX = torusKnotPositions[randomVertexIndex];
      const baseY = torusKnotPositions[randomVertexIndex + 1];
      const baseZ = torusKnotPositions[randomVertexIndex + 2];

      // 頂点周辺にランダムなオフセットを追加
      const offset = 0.08;
      const x = baseX + (Math.random() - 0.5) * offset;
      const y = baseY + (Math.random() - 0.5) * offset;
      const z = baseZ + (Math.random() - 0.5) * offset;

      currentPositions[i * 3] = x;
      currentPositions[i * 3 + 1] = y;
      currentPositions[i * 3 + 2] = z;

      sizes[i] = 0.015 + Math.random() * 0.025;
    }

    torusKnotGeometry.dispose();

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // シェーダーマテリアル
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

          // 基本の揺れ
          pos.x += sin(time * 0.5 + position.y * 2.0) * 0.01;
          pos.y += cos(time * 0.5 + position.z * 2.0) * 0.01;
          pos.z += sin(time * 0.5 + position.x * 2.0) * 0.01;

          // ワープモード
          if (warpMode > 0.0) {
            float warpStrength = warpMode * 0.5;
            pos.x += sin(time * 2.0 + pos.y * 0.5) * warpStrength;
            pos.y += cos(time * 1.5 + pos.z * 0.3) * warpStrength;
            pos.z += sin(time * 1.8 + pos.x * 0.4) * warpStrength;
          }

          // マグネティックモード
          if (magneticMode > 0.0) {
            vec3 mousePos3D = vec3(mousePos * 8.0, 0.0);
            vec3 toMouse = mousePos3D - pos;
            float distance = length(toMouse);
            if (distance < 10.0) {
              float pull = (10.0 - distance) / 10.0;
              pos += normalize(toMouse) * pull * magneticMode * 0.8;
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

    // アニメーション
    let time = 0;
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.008;

      // 回転
      particles.rotation.y += 0.003;
      particles.rotation.x += 0.002;

      // シェーダーの更新（refから最新の値を取得）
      material.uniforms.time.value = time;
      material.uniforms.mousePos.value.set(mouseNormalizedX, mouseNormalizedY);
      material.uniforms.warpMode.value = warpModeRef.current ? 1.0 : 0.0;
      material.uniforms.magneticMode.value = magneticModeRef.current ? 1.0 : 0.0;

      renderer.render(scene, camera);
    };
    animate();

    // リサイズ対応
    const handleResize = () => {
      if (!container) return;

      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // クリーンアップ
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
