// lib/shaders/sunShader.ts

export const sunVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  uniform float time;

  // ノイズ関数
  float noise(vec3 pos) {
    return sin(pos.x * 2.0) * sin(pos.y * 3.0) * sin(pos.z * 5.0);
  }

  void main() {
    vPosition = position;
    vNormal = normal;
    vUv = uv;

    vec3 pos = position;

    // 炎のような動的な変形
    float n1 = noise(position + time * 2.0) * 0.1;
    float n2 = noise(position * 2.0 + time * 1.5) * 0.05;
    float n3 = noise(position * 4.0 + time * 3.0) * 0.02;

    pos += normal * (n1 + n2 + n3);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const sunFragmentShader = `
  uniform float time;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  // ノイズ関数
  float noise(vec2 pos) {
    return sin(pos.x * 10.0 + time) * sin(pos.y * 10.0 + time * 1.3);
  }

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(vNormal, viewDirection), 1.5);

    // 炎のような色彩変化
    float n1 = noise(vUv * 5.0 + time * 2.0) * 0.5 + 0.5;
    float n2 = noise(vUv * 8.0 + time * 1.8) * 0.5 + 0.5;
    float n3 = noise(vUv * 12.0 + time * 2.5) * 0.5 + 0.5;

    vec3 color = mix(color1, color2, n1);
    color = mix(color, color3, n2 * 0.7);

    // 表面の輝き
    color += vec3(1.0, 0.8, 0.3) * n3 * 0.3;

    // フレネル効果で輪郭を明るく
    color += vec3(1.0, 0.9, 0.5) * fresnel * 0.8;

    gl_FragColor = vec4(color, 1.0);
  }
`;
