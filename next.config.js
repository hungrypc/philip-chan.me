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
      loader: 'custom',
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
    env: {
      nextImageExportOptimizer_imageFolderPath: 'public/media',
      nextImageExportOptimizer_exportFolderPath: 'out',
      nextImageExportOptimizer_quality: 75,
      nextImageExportOptimizer_storePicturesInWEBP: true,
      nextImageExportOptimizer_generateAndUseBlurImages: true,
    },
  })
}
