// components/RightInfo.tsx
'use client';

export default function RightInfo() {
  return (
    <div className="right-info">
      <h3>Solar System Portfolio</h3>
      <p className="concept">
        Interactive portfolio inspired
        <br />
        by the solar system
      </p>
      <div className="usage-tips hide-on-mobile">
        <p>☀️ Click the sun to reload</p>
        <p>🪐 Click planets to explore</p>
        <p>⚙️ Customize via left menu</p>
        <p>🌐 Language toggle available</p>
      </div>
    </div>
  );
}
