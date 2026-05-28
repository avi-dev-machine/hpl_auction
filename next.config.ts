import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://avi-dev-machine-hpl-auction.hf.space/api/:path*",
      },
    ];
  },
};

export default nextConfig;
