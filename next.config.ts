import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        stream: false,
        util: false,
        zlib: false,
        http: false,
        https: false,
        crypto: false,
        'fs/promises': false
      };
    }
    return config;
  },
  // Configure serverExternalPackages for Node.js modules
  serverExternalPackages: ['youtube-transcript-plus'],
  experimental: {
    serverExternalPackages: ['youtube-transcript-plus']
  }
};

export default nextConfig; 