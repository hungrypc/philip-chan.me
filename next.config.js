/* eslint-disable @typescript-eslint/no-var-requires */
const withPreact = require('next-plugin-preact')

/** @type {import('next').NextConfig} */
const nextConfig = withPreact({
  reactStrictMode: true,
  swcMinify: true,
})

module.exports = nextConfig
