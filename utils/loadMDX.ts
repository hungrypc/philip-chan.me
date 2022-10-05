import fs from 'fs'
import matter from 'gray-matter'
import { bundleMDX } from 'mdx-bundler'
import path from 'path'
import rehypeAutolink from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkPrism from 'remark-prism'
import glob from 'tiny-glob'

import { autoLinkHeadingsOptions, getTOC } from './plugins'

const RootPath = process.cwd()
const PostPath = path.join(RootPath, 'posts')
const NotePath = path.join(RootPath, 'notes')

export async function loadMDX(source: string, shouldRenderTOC = true) {
  const toc: { id: string; text: string }[] = []
  const bundle = await bundleMDX({
    source,
    mdxOptions(options) {
      options.remarkPlugins = [...(options?.remarkPlugins ?? []), remarkGfm, remarkPrism]
      options.rehypePlugins = [
        ...(options?.rehypePlugins ?? []),
        rehypeSlug,
        [rehypeAutolink, autoLinkHeadingsOptions],
        getTOC(toc, shouldRenderTOC),
      ]
      return options
    },
  })

  return { ...bundle, toc }
}

const getAllContentMetaByPath = (contentTypePath: string) => async () => {
  const allContentPaths = await glob(`${contentTypePath}/**/*.mdx`)

  return allContentPaths
    .map((contentPath): ContentMeta => {
      const post = fs.readFileSync(path.join(RootPath, contentPath), 'utf-8')
      const slug = path.basename(contentPath).replace('.mdx', '')
      const meta = matter(post).data

      return { ...meta, slug } as ContentMeta
    })
    .filter(meta => meta.published)
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
}

const getContent = (contentTypePath: string) => async (slug: string) => {
  const source = fs.readFileSync(path.join(contentTypePath, `${slug}.mdx`), 'utf-8')
  const { code, frontmatter, toc } = await loadMDX(source)
  const meta = { ...frontmatter, slug } as ContentMeta

  return { meta, toc, code }
}

// get meta data of content
export const getAllPostsMeta = getAllContentMetaByPath(PostPath)
export const getAllNotesMeta = getAllContentMetaByPath(NotePath)

// get single content by slug
export const getPost = getContent(PostPath)
export const getNote = getContent(NotePath)
