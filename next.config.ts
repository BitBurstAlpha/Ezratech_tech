import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Netlify scans build output. Turbopack's persistent cache can contain build environment values.
  experimental: process.env.NETLIFY === "true"
    ? { turbopackFileSystemCacheForBuild: false }
    : undefined,
};

export default nextConfig;
