import { promises as fsPromises } from 'fs'
import { join } from 'path'
import glob from 'tiny-glob'

const RootDir = '.'

function doubleDigit(n: number) {
  return n > 9 ? '' + n : '0' + n
}

async function buildMedia() {
  const files = await glob(`*`, { cwd: `${RootDir}/public/images/` })
  const images: string[] = []

  for (const file of files) {
    const extension = file.split('.')[1]

    if (extension === 'jpg') {
      images.push(file)
    }
  }

  images.reverse()

  const exports = ['// This is a generated file\n\n']
  let count = 1
  const imgNames: string[] = []
  for (const image of images) {
    const name = `file${doubleDigit(count)}`
    imgNames.push(name)
    exports.push(`import ${name} from '../public/images/${image}'\n`)
    count += 1
  }

  exports.push(`\nexport const images = [${imgNames.toString()}]\n`)

  await fsPromises.writeFile(join('.', 'utils', 'media.ts'), exports.join(''), 'utf-8')
}

buildMedia()
