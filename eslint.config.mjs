import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [".next/**", "node_modules/**"],
  },
  {
    rules: {
      "@next/next/no-page-custom-font": "off",
    },
  },
  {
    files: [
      "src/components/ThreeCanvas.tsx",
      "src/components/**/Particle*.tsx",
    ],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
