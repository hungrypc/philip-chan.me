import React, { useMemo } from 'react'

import fs from 'fs'
import { getMDXComponent } from 'mdx-bundler/client'
import { InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import path from 'path'

import { Break } from '@components/layout'
import { components } from '@components/MDXComponents'
import { About, Experience } from '@components/me'
import { loadMDX } from '@utils/loadMDX'

export const getStaticProps = async () => {
  const file = path.resolve(process.cwd(), 'content', 'home.mdx')
  const source = fs.readFileSync(file, 'utf-8')
  const { code } = await loadMDX(source, false)

  /* load posts on Home */
  // const posts = await getAllPostsMeta()
  // return { props: { code, posts } }

  return { props: { code } }
}

const mdxComponents = { ...components, About, Experience, Break, Image }

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Home: React.FC<Props> = ({ code }) => {
  const Component = useMemo(() => getMDXComponent(code), [code])

  return (
    <article className='mx-auto max-w-[100ch] px-5 pt-12 pb-28'>
      <Component components={mdxComponents} />
    </article>
  )
}

export default Home
