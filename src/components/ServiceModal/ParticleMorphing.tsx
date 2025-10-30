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
  const morphToPyramidRef = useRef(morphToPyramid);
  const warpModeRef = useRef(warpMode);
  const magneticModeRef = useRef(magneticMode);

  useEffect(() => {
    morphToPyramidRef.current = morphToPyramid;
  }, [morphToPyramid]);

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

    // 立方体の座標生成
    const boxPositions = new Float32Array(particleCount * 3);
    const boxSize = 1.0;

    for (let i = 0; i < particleCount; i++) {
      const face = Math.floor(Math.random() * 6);
      let x, y, z;

      switch (face) {
        case 0:
          x = (Math.random() - 0.5) * boxSize * 2;
          y = (Math.random() - 0.5) * boxSize * 2;
          z = boxSize;
          break;
        case 1:
          x = (Math.random() - 0.5) * boxSize * 2;
          y = (Math.random() - 0.5) * boxSize * 2;
          z = -boxSize;
          break;
        case 2:
          x = (Math.random() - 0.5) * boxSize * 2;
          y = boxSize;
          z = (Math.random() - 0.5) * boxSize * 2;
          break;
        case 3:
          x = (Math.random() - 0.5) * boxSize * 2;
          y = -boxSize;
          z = (Math.random() - 0.5) * boxSize * 2;
          break;
        case 4:
          x = boxSize;
          y = (Math.random() - 0.5) * boxSize * 2;
          z = (Math.random() - 0.5) * boxSize * 2;
          break;
        case 5:
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

    // 現在の位置配列
    const currentPositions = new Float32Array(particleCount * 3);
    currentPositions.set(boxPositions);

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
            float warpAmount = sin(pos.z * 2.0 + time) * 0.3;
            pos.x += warpAmount;
          }

          if (magneticMode > 0.5) {
            vec2 toMouse = mousePos - pos.xy;
            float dist = length(toMouse);
            float pullStrength = 0.3 / (dist + 1.0);
            pos.xy += toMouse * pullStrength;
          }

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
          gl_FragColor = vec4(0.2, 0.8, 0.4, alpha * 0.8);
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

      // モーフィングアニメーション（AboutModalと同じ方式）
      const targetMorphProgress = morphToPyramidRef.current ? 1 : 0;
      const morphSpeed = 0.02;

      if (morphProgress < targetMorphProgress) {
        morphProgress = Math.min(morphProgress + morphSpeed, targetMorphProgress);
      } else if (morphProgress > targetMorphProgress) {
        morphProgress = Math.max(morphProgress - morphSpeed, targetMorphProgress);
      }

      // 位置を補間
      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = boxPositions[i] + (pyramidPositions[i] - boxPositions[i]) * morphProgress;
      }
      geometry.attributes.position.needsUpdate = true;

      material.uniforms.time.value = elapsed;
      material.uniforms.warpMode.value = warpModeRef.current ? 1.0 : 0.0;
      material.uniforms.magneticMode.value = magneticModeRef.current ? 1.0 : 0.0;

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
