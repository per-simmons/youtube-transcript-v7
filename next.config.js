/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Enable the dotAll flag ('s') in regular expressions
    // This is required for regex patterns that span multiple lines
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: [['@babel/plugin-transform-unicode-property-regex', { useUnicodeFlag: false }]]
        }
      }
    });

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
  // Add both youtube-transcript-plus and cheerio to external packages
  serverExternalPackages: ['youtube-transcript-plus', 'cheerio', 'node-fetch'],
  // Add this to ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;