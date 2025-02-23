/* eslint-disable @typescript-eslint/no-var-requires */
const { promises: fsPromises } = require('fs')
const { join } = require('path')
const glob = require('tiny-glob')

const RootDir = './public/media'

const getImageName = file => file.replace(/\.(webp|jpg|jpeg)/, '').replace(/-/g, '_')

const generateImageImports = async (exportsFile, path) => {
  const files = await glob(`*`, { cwd: `${path}` })
  const images = {}

  for (const file of files) {
    const [, extension] = file.split('.')
    if (extension === undefined) {
      // if file is a directory, recursively go through files
      const subdirectory = await generateImageImports(exportsFile, `${path}/${file}`)
      images[file] = subdirectory
    } else {
      // if file is a file, check if it is an image and build the export
      if (['WEBP', 'JPG', 'JPEG'].includes(extension?.toUpperCase())) {
        const name = getImageName(file)
        exportsFile.push(`import _${name} from '../.${path}/${file}'\n`)
        images[name] = file
      }
    }
  }
  return images
}

const getTabSpaces = (level, tabSize = 2) => {
  const spaces = ' '.repeat(level * tabSize)
  return spaces
}

const generateDirectoryImageExports = (imagesObj, level) => {
  const tabs = getTabSpaces(level)
  const arr = []
  for (const key in imagesObj) {
    const isString = typeof imagesObj[key] === 'string'
    if (isString) {
      const name = getImageName(imagesObj[key])
      arr.push(`${tabs}${key}: _${name},\n`)
    } else {
      arr.push(`\n${tabs}${key}: {\n`)
      arr.push(...generateDirectoryImageExports(imagesObj[key], level + 1))
    }
  }
  arr.push(`${getTabSpaces(level - 1)}${level === 1 ? '\n' : ''}}${level > 1 ? ',' : ''}`)
  return arr
}

async function buildMedia() {
  const exportsFile = ['// This is a generated file\n\n']
  const imageImports = await generateImageImports(exportsFile, RootDir)

  for (const key in imageImports) {
    const isString = typeof imageImports[key] === 'string'
    if (isString) {
      const name = getImageName(imageImports[key])
      exportsFile.push(`\nexport const ${key} = _${name}\n`)
    } else {
      const directoryExports = generateDirectoryImageExports(imageImports[key], 1)
      exportsFile.push(`\nexport const ${key} = {`)
      exportsFile.push(...directoryExports)
    }
  }
  exportsFile.push('\n')

  await fsPromises.writeFile(join('.', 'utils', 'media', 'media.ts'), exportsFile.join(''), 'utf-8')
}

buildMedia()
