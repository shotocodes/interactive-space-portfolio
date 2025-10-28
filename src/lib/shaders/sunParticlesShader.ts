// lib/shaders/sunParticlesShader.ts

export const sunParticlesVertexShader = `
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;
  uniform float time;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    // 炎のような揺らぎ
    mvPosition.xyz += sin(time * 3.0 + position.x * 0.1) * 0.02;
    mvPosition.xyz += cos(time * 2.5 + position.y * 0.1) * 0.02;

    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const sunParticlesFragmentShader = `
  varying vec3 vColor;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float r = length(center);
    if (r > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.0, 0.5, r);
    gl_FragColor = vec4(vColor, alpha * 0.9);
  }
`;
