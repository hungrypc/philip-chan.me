/* eslint-disable @typescript-eslint/no-var-requires */
const withPreact = require('next-plugin-preact')

/** @type {import('next').NextConfig} */
module.exports = () => {
  const plugins = [withPreact]
  return plugins.reduce((acc, next) => next(acc), {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      // domains: ['res.cloudinary.com'],
    },
  })
}
