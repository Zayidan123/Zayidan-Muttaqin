import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_PLATFORM_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: process.env.CLOUDFLARE_BUILD === 'true',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  transpilePackages: ['motion'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        ],
      },
    ]
  },
  webpack: (config, {dev}) => {
    config.parallelism = 1;
    config.cache = false;
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: false,
      };
    }
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
