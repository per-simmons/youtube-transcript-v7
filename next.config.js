/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure serverExternalPackages for Node.js modules
  serverExternalPackages: ['youtube-transcript-plus'],
  
  // Configure webpack for Node.js modules with proper fallbacks
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
  
  // Include experimental configuration
  experimental: {
    serverComponentsExternalPackages: ['youtube-transcript-plus']
  }
};

module.exports = nextConfig; 