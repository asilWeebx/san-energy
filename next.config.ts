import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dukonline.uz" },
      { protocol: "https", hostname: "**.digitaloceanspaces.com" },
      { protocol: "https", hostname: "**.cdn.digitaloceanspaces.com" },
      // San-hydro rasm backend (Django) — lokal dev
      { protocol: "http", hostname: "localhost", port: "8009" },
      { protocol: "http", hostname: "127.0.0.1", port: "8009" },
    ],
  },
};

export default nextConfig;
