/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // SSRの警告を抑制（開発環境のみ）
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig
