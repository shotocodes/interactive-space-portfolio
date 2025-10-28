// lib/shaders/sunFlaresShader.ts

export const sunFlaresVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float time;

  void main() {
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const sunFlaresFragmentShader = `
  uniform float time;
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(vNormal, viewDirection), 2.0);

    // 動的な光の強度
    float intensity = sin(time * 2.0 + vPosition.x) * 0.3 + 0.7;

    vec3 coronaColor = vec3(1.0, 0.7, 0.3) * fresnel * intensity;

    gl_FragColor = vec4(coronaColor, fresnel * 0.4);
  }
`;
