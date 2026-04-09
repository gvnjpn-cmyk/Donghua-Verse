/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.app.orbitcloud.web.id',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.orbitcloud.web.id',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.orbitcloud.web.id',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.cdnjson.com',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
