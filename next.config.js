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
  serverExternalPackages: ['tiktok-live-connector', 'protobufjs'],
  experimental: {
    serverComponentsExternalPackages: ['tiktok-live-connector', 'protobufjs'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'tiktok-live-connector', 'protobufjs']
    }
    config.module.rules.push({
      test: /\.proto$/,
      type: 'asset/source',
    })
    return config
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
