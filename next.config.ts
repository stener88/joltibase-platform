import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Exclude esbuild from bundling (used for TSX transpilation in emails/lib/renderer.ts)
  serverExternalPackages: ['esbuild'],
};

export default nextConfig;
