/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable static export for GitHub Pages (when GITHUB_PAGES env is set)
  // Otherwise use standalone for Docker deployment
  output: process.env.GITHUB_PAGES ? 'export' : 'standalone',
  
  // Base path for GitHub Pages (repository name)
  basePath: process.env.GITHUB_PAGES ? '/fafsa_application_assistant' : '',
  assetPrefix: process.env.GITHUB_PAGES ? '/fafsa_application_assistant/' : '',
  
  // Disable image optimization for static export
  images: process.env.GITHUB_PAGES ? {
    unoptimized: true,
  } : {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'studentaid.gov',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'st2.depositphotos.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cbx-prod.b-cdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kgo-asset-cache.modolabs.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.ymaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dfjx2uxqg3cgi.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.theatlantic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'thumbs.dreamstime.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ncan.org',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Trailing slash for GitHub Pages compatibility
  trailingSlash: process.env.GITHUB_PAGES ? true : false,
}

module.exports = nextConfig
