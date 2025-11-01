// components/RightInfo.tsx
'use client';

export default function RightInfo() {
  return (
    <div className="right-info">
      <h3>Solar System Portfolio</h3>
      <p className="concept">
        地動説をコンセプトにした
        <br />
        インタラクティブポートフォリオ
      </p>
      {/* スマホでは非表示 */}
      <div className="usage-tips hide-on-mobile">
        <p>☀️ 太陽をクリックでリロード</p>
        <p>🪐 惑星をクリックして詳細表示</p>
        <p>⚙️ 左メニューで設定変更</p>
        <p>🌐 言語切替可能</p>
      </div>
    </div>
  );
}
