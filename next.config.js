/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure serverExternalPackages for Node.js modules
  serverExternalPackages: ['youtube-transcript-plus'],
  
  // Configure webpack for Node.js modules with proper fallbacks
  webpack: (config, { isServer }) => {
    // If it's a client-side bundle, provide polyfills or empty modules for Node.js modules
    if (!isServer) {
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
        'fs/promises': false,
      };
    }
    
    return config;
  },
  
  // Include experimental configuration
  experimental: {
    serverExternalPackages: ['youtube-transcript-plus']
  }
};

module.exports = nextConfig; 