/* eslint-disable @typescript-eslint/no-var-requires */
const { promises: fsPromises } = require('fs')
const { join } = require('path')
const glob = require('tiny-glob')

const RootDir = '.'

function doubleDigit(n) {
  return n > 9 ? '' + n : '0' + n
}

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
  let count = 1
  const imgNames = []
  for (const image of images) {
    const name = `file${doubleDigit(count)}`
    imgNames.push(name)
    exports.push(`import ${name} from '../../public/media/${image}'\n`)
    count += 1
  }

  exports.push(`\nexport const images = [${imgNames.toString()}]\n`)

  await fsPromises.writeFile(join('.', 'utils', 'media', 'media.ts'), exports.join(''), 'utf-8')
}

buildMedia()
