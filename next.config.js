/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even if your project has type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if your project has ESLint errors
    ignoreDuringBuilds: true,
  },
  // Use webpack to mock Supabase during build
  webpack: (config, { isServer, dev }) => {
    // Only apply this in production build, but for both client and server
    if (!dev) {
      // Mock @supabase/supabase-js
      config.resolve.alias['@supabase/supabase-js'] = require.resolve('./mocks/supabase-js.js');
      // Mock @supabase/auth-helpers-nextjs
      config.resolve.alias['@supabase/auth-helpers-nextjs'] = require.resolve('./mocks/auth-helpers-nextjs.js');
    }
    return config;
  },
  // Add environment variables with fallbacks for build time
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
  }
}

module.exports = nextConfig 