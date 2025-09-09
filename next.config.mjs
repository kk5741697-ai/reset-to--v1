/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Disable SWC minifier to prevent build issues
  swcMinify: false,
  // Optimize for development
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  env: {
    NEXT_PUBLIC_ADSENSE_PUBLISHER_ID: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://pixoratools.com',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  webpack: (config, { isServer, dev }) => {
    // Fix fallback issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
      stream: false,
      util: false,
      buffer: false,
    }
    
    // Handle canvas and other browser-only modules
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('canvas')
      config.externals.push('jsdom')
    }
    
    // Optimize for development
    if (dev) {
      config.cache = false
    }
    
    return config
  },
}

export default nextConfig