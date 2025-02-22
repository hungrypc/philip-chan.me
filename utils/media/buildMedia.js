/* eslint-disable @typescript-eslint/no-var-requires */
const { promises: fsPromises } = require('fs')
const { join } = require('path')
const glob = require('tiny-glob')

const RootDir = '.'

async function buildMedia() {
  const files = await glob(`*`, { cwd: `${RootDir}/public/media/` })
  const images = []

  for (const file of files) {
    const [, extension] = file.split('.')

    if (['WEBP', 'JPG', 'JPEG'].includes(extension?.toUpperCase())) {
      images.push(file)
    }
  }

  const exports = ['// This is a generated file\n\n']
  const imgNames = []
  for (const image of images) {
    const name = image.replace(/\.(webp|jpg|jpeg)/, '').replace(/-/g, '_')
    imgNames.push(name)
    exports.push(`import ${name} from '../../public/media/${image}'\n`)
  }

  exports.push(`\nexport const images = {${imgNames.map(n => `\n  ${n}`)},\n}\n`)

  await fsPromises.writeFile(join('.', 'utils', 'media', 'media.ts'), exports.join(''), 'utf-8')
}

buildMedia()
