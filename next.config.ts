import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/cs",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
