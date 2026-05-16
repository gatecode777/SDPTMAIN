import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["mongoose"],
  allowedDevOrigins: ["192.168.1.81", "localhost:3000"],
};

export default nextConfig;
