// components/ThreeCanvas.tsx (Part 1 - Setup & Initialization)
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { shallow } from 'zustand/shallow';
import { planetData, actionPlanetData } from '@/lib/data/planetData';
import { languageData } from '@/lib/data/languageData';
import { sunVertexShader, sunFragmentShader } from '@/lib/shaders/sunShader';
import { sunParticlesVertexShader, sunParticlesFragmentShader } from '@/lib/shaders/sunParticlesShader';
import { sunFlaresVertexShader, sunFlaresFragmentShader } from '@/lib/shaders/sunFlaresShader';

export default function ThreeCanvas() {
  console.log('ThreeCanvas rendered');

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sunRef = useRef<THREE.Mesh | null>(null);
  const sunParticlesRef = useRef<THREE.Points | null>(null);
  const sunFlaresRef = useRef<THREE.Mesh | null>(null);
  const planetsRef = useRef<THREE.Mesh[]>([]);
  const actionPlanetsRef = useRef<THREE.Mesh[]>([]);
  const orbitParticlesRef = useRef<THREE.Points[]>([]);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const timeRef = useRef<number>(0);
  const targetCameraRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const hoveredPlanetRef = useRef<THREE.Mesh | null>(null);

  const {
    setPlanetInfoData,
    setHoveredPlanet,
    hoveredPlanet
  } = usePortfolioStore();

  // languageもrefで管理
  const language = usePortfolioStore((state) => state.language, shallow);
  const languageRef = useRef(language);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  // configはshallow比較で取得
  const config = usePortfolioStore(
    (state) => state.config,
    shallow
  );

  // configをrefで保持（アニメーションループで最新の値を参照するため）
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
    console.log('Config updated in ThreeCanvas:', config.orbitSpeed);
  }, [config]);

  useEffect(() => {
    if (!containerRef.current) return;

    // モバイル判定
    const isMobile = window.innerWidth <= 768;
    const mobileScale = isMobile ? 0.6 : 1.0;

    // シーン作成
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // カメラ作成
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 12);
    cameraRef.current = camera;

    // レンダラー作成
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // レイキャスター
    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;

    // カーソル要素を取得
    cursorRef.current = document.querySelector('.custom-cursor');

    // ライティング設定
    setupLighting(scene);

    // 太陽作成
    createSun(scene);

    // 太陽パーティクル作成
    createSunParticles(scene);

    // 太陽フレア作成
    createSunFlares(scene);

    // 軌道リング作成
    createOrbitRings(scene);

    // 惑星作成
    createPlanets(scene);

    // アクション惑星作成
    createActionPlanets(scene);

    // イベントリスナー設定
    setupEventListeners();

    // アニメーション開始
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      timeRef.current += 0.016;

      // カメラのスムーズな追従
      camera.position.x += (targetCameraRef.current.x - camera.position.x) * 0.05;
      camera.position.y += (targetCameraRef.current.y - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // 太陽の回転とアニメーション
      if (sunRef.current) {
        sunRef.current.rotation.y += 0.01;
        (sunRef.current.material as THREE.ShaderMaterial).uniforms.time.value = timeRef.current;
      }

      // 太陽パーティクルのアニメーション
      if (sunParticlesRef.current) {
        sunParticlesRef.current.rotation.y += 0.005;
        (sunParticlesRef.current.material as THREE.ShaderMaterial).uniforms.time.value = timeRef.current;
      }

      // 太陽フレアのアニメーション
      if (sunFlaresRef.current) {
        sunFlaresRef.current.rotation.y -= 0.003;
        (sunFlaresRef.current.material as THREE.ShaderMaterial).uniforms.time.value = timeRef.current;
      }

      // 軌道リングの回転
      orbitParticlesRef.current.forEach((ring, index) => {
        ring.rotation.y += 0.001 * (index + 1);
      });

      // 惑星の公転と自転
      planetsRef.current.forEach((planet, index) => {
        const data = planet.userData;
        data.angle += 0.01 * configRef.current.orbitSpeed * (1 + index * 0.1);

        planet.position.x = Math.cos(data.angle) * data.baseRadius;
        planet.position.z = Math.sin(data.angle) * data.baseRadius;
        planet.rotation.y += 0.02;
      });

      // アクション惑星の公転と自転
      actionPlanetsRef.current.forEach((planet, index) => {
        const data = planet.userData;
        data.angle -= 0.015 * configRef.current.orbitSpeed * (1 + index * 0.05);

        planet.position.x = Math.cos(data.angle) * data.baseRadius;
        planet.position.z = Math.sin(data.angle) * data.baseRadius;
        planet.rotation.y += 0.03;
      });

      renderer.render(scene, camera);
    };
    animate();

    // ウィンドウリサイズ
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // クリーンアップ
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);

      // Three.jsオブジェクトの破棄
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // config変更時の更新
  useEffect(() => {
    // 軌道半径の更新
    planetsRef.current.forEach((planet) => {
      planet.userData.baseRadius = config.orbitRadius;
    });
    actionPlanetsRef.current.forEach((planet) => {
      planet.userData.baseRadius = config.actionOrbitRadius;
    });

    // 太陽サイズの更新（太陽本体は変更しない）
    // フレアのみスケール変更
    if (sunFlaresRef.current) {
      sunFlaresRef.current.scale.setScalar(config.sunSize);
    }

    // 太陽パーティクル数の更新
    if (config.sunParticleCount !== sunParticlesRef.current?.userData.particleCount) {
      if (sceneRef.current && sunParticlesRef.current) {
        sceneRef.current.remove(sunParticlesRef.current);
        createSunParticles(sceneRef.current);
      }
    }
  }, [config]);

  // 続く... (Part 2で関数定義)


// components/ThreeCanvas.tsx (Part 2 - Helper Functions)
// これをPart 1の最後（return文の前）に追加してください

  // ライティング設定
  const setupLighting = (scene: THREE.Scene) => {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffa500, 2.0, 100);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const fillLight = new THREE.PointLight(0xff6b35, 0.5, 50);
    fillLight.position.set(0, 0, 0);
    scene.add(fillLight);
  };

  // 太陽作成
  const createSun = (scene: THREE.Scene) => {
    const sunGeometry = new THREE.SphereGeometry(1, 64, 64);
    const sunMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0xff4500) },
        color2: { value: new THREE.Color(0xffa500) },
        color3: { value: new THREE.Color(0xffff00) }
      },
      vertexShader: sunVertexShader,
      fragmentShader: sunFragmentShader,
      transparent: false
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sunRef.current = sun;
    scene.add(sun);
  };

  // 太陽パーティクル作成
  const createSunParticles = (scene: THREE.Scene) => {
    const particleCount = configRef.current.sunParticleCount;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1 + 0.3 + Math.random() * 2.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const color = new THREE.Color();
      const hue = 0.05 + Math.random() * 0.1;
      color.setHSL(hue, 0.9, 0.6 + Math.random() * 0.4);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = 0.05 + Math.random() * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: sunParticlesVertexShader,
      fragmentShader: sunParticlesFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false
    });

    const sunParticles = new THREE.Points(geometry, material);
    sunParticles.userData.particleCount = particleCount;
    sunParticlesRef.current = sunParticles;
    scene.add(sunParticles);
  };

  // 太陽フレア作成
  const createSunFlares = (scene: THREE.Scene) => {
    const flareGeometry = new THREE.SphereGeometry(1.8, 32, 32);
    const flareMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: sunFlaresVertexShader,
      fragmentShader: sunFlaresFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });

    const sunFlares = new THREE.Mesh(flareGeometry, flareMaterial);
    sunFlaresRef.current = sunFlares;
    scene.add(sunFlares);
  };

  // 軌道リング作成
  const createOrbitRings = (scene: THREE.Scene) => {
    const ringCount = 3;

    for (let ring = 0; ring < ringCount; ring++) {
      const particleCount = 500 + ring * 200;
      const radius = configRef.current.orbitRadius + ring * 1.5;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 0.1;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.008,
        transparent: true,
        opacity: 0.6 - ring * 0.1,
        blending: THREE.AdditiveBlending
      });

      const orbitRing = new THREE.Points(geometry, material);
      orbitParticlesRef.current.push(orbitRing);
      scene.add(orbitRing);
    }
  };

  // 惑星作成
  const createPlanets = (scene: THREE.Scene) => {
    planetsRef.current = [];

    for (let i = 0; i < configRef.current.planetCount; i++) {
      const data = planetData[i];
      const angle = (i / configRef.current.planetCount) * Math.PI * 2;

      const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
      const planetMaterial = new THREE.MeshPhongMaterial({
        color: data.color,
        shininess: 100,
        transparent: true,
        opacity: 0.9
      });

      const planet = new THREE.Mesh(planetGeometry, planetMaterial);

      planet.position.x = Math.cos(angle) * configRef.current.orbitRadius;
      planet.position.z = Math.sin(angle) * configRef.current.orbitRadius;
      planet.position.y = 0;

      planet.userData = {
        ...data,
        angle: angle,
        baseRadius: configRef.current.orbitRadius,
        originalScale: planet.scale.x
      };

      planetsRef.current.push(planet);
      scene.add(planet);

      const glowGeometry = new THREE.SphereGeometry(data.size * 1.5, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
      });

      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      planet.add(glow);
    }
  };

  // アクション惑星作成
  const createActionPlanets = (scene: THREE.Scene) => {
    actionPlanetsRef.current = [];

    for (let i = 0; i < configRef.current.actionPlanetCount; i++) {
      const data = actionPlanetData[i];
      const angle = (i / configRef.current.actionPlanetCount) * Math.PI * 2 + Math.PI;

      const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
      const planetMaterial = new THREE.MeshPhongMaterial({
        color: data.color,
        shininess: 100,
        transparent: true,
        opacity: 0.9
      });

      const planet = new THREE.Mesh(planetGeometry, planetMaterial);

      planet.position.x = Math.cos(angle) * configRef.current.actionOrbitRadius;
      planet.position.z = Math.sin(angle) * configRef.current.actionOrbitRadius;
      planet.position.y = 0;

      planet.userData = {
        ...data,
        angle: angle,
        baseRadius: configRef.current.actionOrbitRadius,
        originalScale: planet.scale.x,
        isActionPlanet: true
      };

      actionPlanetsRef.current.push(planet);
      scene.add(planet);

      const glowGeometry = new THREE.SphereGeometry(data.size * 2, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
      });

      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      planet.add(glow);
    }
  };

  // イベントリスナー設定
  const setupEventListeners = () => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      targetCameraRef.current.x = mouseX * 2;
      targetCameraRef.current.y = mouseY * 2;

      mouseRef.current.x = mouseX;
      mouseRef.current.y = mouseY;

      checkIntersections();
    };

    const handleClick = () => {
      const currentHoveredPlanet = hoveredPlanetRef.current;
      console.log('Click detected, hoveredPlanet:', currentHoveredPlanet);
      if (!raycasterRef.current || !cameraRef.current) return;

      // 太陽クリック判定
      if (sunRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const sunIntersects = raycasterRef.current.intersectObjects([sunRef.current]);

        if (sunIntersects.length > 0) {
          console.log('Sun clicked');
          document.body.style.transition = 'opacity 0.8s ease';
          document.body.style.opacity = '0';
          setTimeout(() => {
            window.location.reload();
          }, 800);
          return;
        }
      }

      // 惑星クリック判定
      if (currentHoveredPlanet) {
        console.log('Planet clicked:', currentHoveredPlanet.userData);
        const data = currentHoveredPlanet.userData;
        const currentLanguage = languageRef.current;
        const currentData = languageData[currentLanguage];

        console.log('Current language:', currentLanguage);

        if (data.isActionPlanet) {
          if (data.action === 'controls') {
            usePortfolioStore.getState().toggleControls();
          } else {
            const actionData = currentData.actions[data.action as 'sns' | 'blog'];
            let updatedData: any = {
              name: actionData.name,
              description: actionData.description,
              isActionPlanet: true,
              action: data.action
            };

            if (data.action === 'sns') {
              updatedData.links = [
                { name: "Twitter", url: "https://twitter.com/your_twitter" },
                { name: "LinkedIn", url: "https://linkedin.com/in/your_linkedin" },
                { name: "Instagram", url: "https://instagram.com/your_instagram" }
              ];
            } else if (data.action === 'blog') {
              updatedData.links = [
                {
                  name: currentLanguage === 'ja' ? "技術ブログ" : "Tech Blog",
                  url: "https://your-tech-blog.com"
                },
                { name: "Qiita", url: "https://qiita.com/your_qiita" },
                { name: "Zenn", url: "https://zenn.dev/your_zenn" }
              ];
            }

            setPlanetInfoData(updatedData);
          }
        } else {
          const planetKey = data.name.toLowerCase() as 'about' | 'projects' | 'services' | 'contact';
          const planetInfo = currentData.planets[planetKey];

          if (planetInfo) {
            console.log('Setting planet info:', planetInfo);
            setPlanetInfoData({
              name: planetInfo.name,
              description: planetInfo.description,
              link: `#${planetKey}`
            });
          }
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
  };

  // 交差判定
  const checkIntersections = () => {
    if (!raycasterRef.current || !cameraRef.current) return;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    const intersects = raycasterRef.current.intersectObjects([
      ...planetsRef.current,
      ...actionPlanetsRef.current
    ]);

    // すべての惑星をリセット
    [...planetsRef.current, ...actionPlanetsRef.current].forEach((planet) => {
      planet.scale.setScalar(planet.userData.originalScale);
      (planet.material as THREE.MeshPhongMaterial).emissive.setHex(0x000000);
    });

    // 太陽のホバー判定
    if (sunRef.current) {
      const sunIntersects = raycasterRef.current.intersectObjects([sunRef.current]);
      if (sunIntersects.length > 0) {
        if (cursorRef.current) {
          cursorRef.current.style.transform = 'scale(1.5)';
          cursorRef.current.style.background = 'radial-gradient(circle, #ff6b35 0%, transparent 70%)';
        }
        sunRef.current.scale.setScalar(1.1);
      } else {
        if (cursorRef.current) {
          cursorRef.current.style.transform = 'scale(1)';
          cursorRef.current.style.background = 'radial-gradient(circle, #e6ff28 0%, transparent 70%)';
        }
        sunRef.current.scale.setScalar(1.0);
      }
    }

    // 惑星のホバー処理
    if (intersects.length > 0) {
      const planet = intersects[0].object as THREE.Mesh;
      hoveredPlanetRef.current = planet;
      setHoveredPlanet(planet);
      console.log('Planet hovered:', planet.userData.name);

      planet.scale.setScalar(planet.userData.originalScale * 1.3);
      (planet.material as THREE.MeshPhongMaterial).emissive.setHex(0x333333);
    } else {
      if (hoveredPlanetRef.current) {
        console.log('Hover cleared');
      }
      hoveredPlanetRef.current = null;
      setHoveredPlanet(null);
    }
  };

  return <div ref={containerRef} id="container" />;

}
