import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org"
      }
    ],
  }
};

export default nextConfig;
