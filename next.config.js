/* eslint-disable @typescript-eslint/no-var-requires */
const withPreact = require('next-plugin-preact')

/** @type {import('next').NextConfig} */
const nextConfig = withPreact({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // domains: ['res.cloudinary.com'],
    deviceSizes: [600, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
})

module.exports = nextConfig
