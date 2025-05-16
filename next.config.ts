import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client
      config.resolve.fallback = {
        fs: false,
        path: false,
        'fs/promises': false
      };
    }
    return config;
  },
  // Define serverExternalPackages only once, at the top level
  serverExternalPackages: ['youtube-transcript-plus'],
  // Add this to ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig; 