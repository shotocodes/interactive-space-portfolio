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
  const morphToHelixRef = useRef(morphToHelix);
  const warpModeRef = useRef(warpMode);
  const magneticModeRef = useRef(magneticMode);

  useEffect(() => {
    morphToHelixRef.current = morphToHelix;
  }, [morphToHelix]);

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
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // トーラスノットの座標生成
    const torusKnotPositions = new Float32Array(particleCount * 3);
    const p = 2;
    const q = 3;

    for (let i = 0; i < particleCount; i++) {
      const u = (i / particleCount) * Math.PI * 2;

      const cosPU = Math.cos(p * u);
      const sinPU = Math.sin(p * u);
      const cosQU = Math.cos(q * u);
      const sinQU = Math.sin(q * u);

      const r = cosPU + 2;

      const x = r * cosQU;
      const y = r * sinQU;
      const z = -sinPU;

      const tubeRadius = 0.3;
      const angle = Math.random() * Math.PI * 2;
      const tubeX = tubeRadius * Math.cos(angle);
      const tubeY = tubeRadius * Math.sin(angle);

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

    // 現在の位置配列
    const currentPositions = new Float32Array(particleCount * 3);
    currentPositions.set(torusKnotPositions);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        warpMode: { value: warpMode ? 1.0 : 0.0 },
        magneticMode: { value: magneticMode ? 1.0 : 0.0 },
        mousePos: { value: new THREE.Vector2(0, 0) }
      },
      vertexShader: `
        uniform float time;
        uniform float warpMode;
        uniform float magneticMode;
        uniform vec2 mousePos;

        void main() {
          vec3 pos = position;

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

          vec3 color = vec3(0.3, 0.6, 1.0);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 2.0 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;

          float alpha = 1.0 - (dist * 2.0);
          gl_FragColor = vec4(0.5, 0.8, 1.0, alpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let animationId: number;
    let morphProgress = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // モーフィングアニメーション
      const targetMorphProgress = morphToHelixRef.current ? 1 : 0;
      const morphSpeed = 0.02;

      if (morphProgress < targetMorphProgress) {
        morphProgress = Math.min(morphProgress + morphSpeed, targetMorphProgress);
      } else if (morphProgress > targetMorphProgress) {
        morphProgress = Math.max(morphProgress - morphSpeed, targetMorphProgress);
      }

      // 位置を補間（AboutModalと同じ方式）
      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = torusKnotPositions[i] + (helixPositions[i] - torusKnotPositions[i]) * morphProgress;
      }
      geometry.attributes.position.needsUpdate = true;

      material.uniforms.time.value = elapsed;
      material.uniforms.warpMode.value = warpModeRef.current ? 1.0 : 0.0;
      material.uniforms.magneticMode.value = magneticModeRef.current ? 1.0 : 0.0;

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
