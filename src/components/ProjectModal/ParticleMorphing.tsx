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
      const tubeRadius = 0.3; // チューブを太く
      const angle = Math.random() * Math.PI * 2;
      const tubeX = tubeRadius * Math.cos(angle);
      const tubeY = tubeRadius * Math.sin(angle);

      // 法線方向にチューブを配置
      const nx = -cosQU * cosPU;
      const ny = -sinQU * cosPU;
      const nz = -sinPU;

      torusKnotPositions[i * 3] = (x + nx * tubeX) * 0.6; // 0.8 → 0.6に縮小
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

      const spread = 0.1; // 元の細さに戻す
      const baseX = Math.cos(angle) * radius;
      const baseZ = Math.sin(angle) * radius;

      helixPositions[i * 3] = baseX + (Math.random() - 0.5) * spread;
      helixPositions[i * 3 + 1] = y;
      helixPositions[i * 3 + 2] = baseZ + (Math.random() - 0.5) * spread;
    }

    const currentPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      currentPositions[i] = torusKnotPositions[i];
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

          pos.x += sin(time * 0.5 + position.y * 2.0) * 0.01;
          pos.z += cos(time * 0.5 + position.y * 2.0) * 0.01;

          if (warpMode > 0.0) {
            float warpStrength = warpMode * 0.5;
            pos.x += sin(time * 2.0 + pos.y * 0.5) * warpStrength;
            pos.z += cos(time * 1.5 + pos.y * 0.3) * warpStrength;
          }

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
          positions[i3] = torusKnotPositions[i3] + (helixPositions[i3] - torusKnotPositions[i3]) * morphProgressRef.current;
          positions[i3 + 1] = torusKnotPositions[i3 + 1] + (helixPositions[i3 + 1] - torusKnotPositions[i3 + 1]) * morphProgressRef.current;
          positions[i3 + 2] = torusKnotPositions[i3 + 2] + (helixPositions[i3 + 2] - torusKnotPositions[i3 + 2]) * morphProgressRef.current;
        }
        geometry.attributes.position.needsUpdate = true;
      }

      particles.rotation.y += 0.002;

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
  }, []); // particleCountを削除して初回のみ実行

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
