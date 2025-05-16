/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // In Next.js 15.3.2, it's serverExternalPackages, not serverComponentsExternalPackages
  serverExternalPackages: ['youtube-transcript-plus']
};

module.exports = nextConfig; 