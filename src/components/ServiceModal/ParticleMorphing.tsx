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
    const boxSize = 1.0; // 1.5 → 1.0に縮小

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
          x = 0;
          y = 0;
          z = 0;
      }

      boxPositions[i * 3] = x;
      boxPositions[i * 3 + 1] = y;
      boxPositions[i * 3 + 2] = z;
    }

    // ピラミッドの座標生成
    const pyramidPositions = new Float32Array(particleCount * 3);
    const height = 2.5;
    const baseRadius = 1.5;
    const apex = new THREE.Vector3(0, height / 2, 0);
    const base = [
      new THREE.Vector3(-baseRadius, -height / 2, -baseRadius),
      new THREE.Vector3(baseRadius, -height / 2, -baseRadius),
      new THREE.Vector3(baseRadius, -height / 2, baseRadius),
      new THREE.Vector3(-baseRadius, -height / 2, baseRadius),
    ];

    for (let i = 0; i < particleCount; i++) {
      let x, y, z;
      const type = Math.random();

      if (type < 0.7) {
        const faceIndex = Math.floor(Math.random() * 4);
        const v1 = apex;
        const v2 = base[faceIndex];
        const v3 = base[(faceIndex + 1) % 4];

        const r1 = Math.random();
        const r2 = Math.random();
        const sqrtR1 = Math.sqrt(r1);
        const a = 1 - sqrtR1;
        const b = sqrtR1 * (1 - r2);
        const c = sqrtR1 * r2;

        x = a * v1.x + b * v2.x + c * v3.x;
        y = a * v1.y + b * v2.y + c * v3.y;
        z = a * v1.z + b * v2.z + c * v3.z;
      } else {
        x = (Math.random() - 0.5) * baseRadius * 2;
        y = -height / 2;
        z = (Math.random() - 0.5) * baseRadius * 2;
        x = Math.max(-baseRadius, Math.min(baseRadius, x));
        z = Math.max(-baseRadius, Math.min(baseRadius, z));
      }

      pyramidPositions[i * 3] = x;
      pyramidPositions[i * 3 + 1] = y;
      pyramidPositions[i * 3 + 2] = z;
    }

    const currentPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      currentPositions[i] = boxPositions[i];
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
            pos.x += sin(time * 2.0 + pos.y * 0.5) * warpStrength;
            pos.z += cos(time * 1.5 + pos.y * 0.3) * warpStrength;
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
          positions[i3] = boxPositions[i3] + (pyramidPositions[i3] - boxPositions[i3]) * morphProgressRef.current;
          positions[i3 + 1] = boxPositions[i3 + 1] + (pyramidPositions[i3 + 1] - boxPositions[i3 + 1]) * morphProgressRef.current;
          positions[i3 + 2] = boxPositions[i3 + 2] + (pyramidPositions[i3 + 2] - boxPositions[i3 + 2]) * morphProgressRef.current;
        }
        geometry.attributes.position.needsUpdate = true;
      }

      particles.rotation.y += 0.004;

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
