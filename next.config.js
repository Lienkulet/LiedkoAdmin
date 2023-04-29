/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'liedko-ecommerce.s3.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig
