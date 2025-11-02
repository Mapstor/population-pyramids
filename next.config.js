/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  // Optimize for large datasets
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  // Reduce memory usage during build
  webpack: (config, { isServer }) => {
    // Optimize for memory usage
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        maxSize: 244000, // 244KB chunks
        cacheGroups: {
          default: false,
          vendors: false,
          // Split large data files
          data: {
            name: 'data',
            chunks: 'all',
            test: /[\\/]src[\\/]data[\\/]/,
            priority: 20,
            maxSize: 100000 // 100KB for data files
          }
        }
      }
    };
    
    return config;
  }
}

module.exports = nextConfig