import React, { useMemo } from 'react'

import fs from 'fs'
import { getMDXComponent } from 'mdx-bundler/client'
import { InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import path from 'path'

import { Break } from '@components/layout'
import { components } from '@components/MDXComponents'
import { Experience, ItsaMe } from '@components/me'
import { getAllPostsMeta, loadMDX } from '@utils/loadMDX'

export const getStaticProps = async () => {
  const file = path.resolve(process.cwd(), 'content', 'home.mdx')
  const source = fs.readFileSync(file, 'utf-8')

  const { code } = await loadMDX(source)
  const posts = await getAllPostsMeta()

  return { props: { code, posts } }
}

const mdxComponents = { ...components, Experience, Break, Image, ItsaMe }

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Home: React.FC<Props> = ({ code }) => {
  const Component = useMemo(() => getMDXComponent(code), [code])

  return (
    <article className='max-w-[85ch] mx-auto pt-12 pb-28 px-5'>
      <Component components={mdxComponents} />
    </article>
  )
}

export default Home
