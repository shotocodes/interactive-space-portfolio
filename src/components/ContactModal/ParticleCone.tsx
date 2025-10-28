// components/ContactModal/ParticleCone.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleConeProps {
  warpMode?: boolean;
  magneticMode?: boolean;
  particleCount?: number;
}

export default function ParticleCone({
  warpMode = false,
  magneticMode = false,
  particleCount = 15000
}: ParticleConeProps) {
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

    // 円錐の座標を生成 - 面と底を埋める
    const currentPositions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    let mouseNormalizedX = 0;
    let mouseNormalizedY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseNormalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNormalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // 円錐のパラメータ
    const height = 2.8;
    const baseRadius = 1.3;
    const apex = new THREE.Vector3(0, height / 2, 0); // 頂点

    // 粒子を配置
    for (let i = 0; i < particleCount; i++) {
      let x, y, z;
      const type = Math.random();

      if (type < 0.7) {
        // 70%: 円錐の側面に配置
        const heightRatio = Math.random(); // 0 (底) to 1 (頂点)
        const angle = Math.random() * Math.PI * 2;
        const currentRadius = baseRadius * (1 - heightRatio); // 頂点に向かって細くなる

        x = Math.cos(angle) * currentRadius;
        y = -height / 2 + heightRatio * height;
        z = Math.sin(angle) * currentRadius;
      } else {
        // 30%: 底面（円形）に配置
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * baseRadius; // 均等分布

        x = Math.cos(angle) * radius;
        y = -height / 2;
        z = Math.sin(angle) * radius;
      }

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

          // 基本の揺れ
          pos.x += sin(time * 0.5 + position.y * 2.0) * 0.008;
          pos.y += cos(time * 0.5 + position.z * 2.0) * 0.008;
          pos.z += sin(time * 0.5 + position.x * 2.0) * 0.008;

          // ワープモード - 上向きの動き
          if (warpMode > 0.0) {
            float warpStrength = warpMode * 0.5;
            float heightFactor = (pos.y + 1.4) / 2.8;
            pos.x += sin(time * 2.0 + pos.y * 0.5) * warpStrength * (1.0 - heightFactor * 0.3);
            pos.y += sin(time * 1.5) * warpStrength * 0.4;
            pos.z += cos(time * 1.8 + pos.x * 0.4) * warpStrength * (1.0 - heightFactor * 0.3);
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

      // ゆっくり回転
      particles.rotation.y += 0.004;
      particles.rotation.x = Math.sin(time * 0.3) * 0.1;

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
