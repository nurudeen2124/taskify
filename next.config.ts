import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
