import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://space.coinyou.io/:path*',
      },
    ];
  },
};

export default nextConfig;
