import React, { useMemo } from 'react'

import fs from 'fs'
import { getMDXComponent } from 'mdx-bundler/client'
import { InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import path from 'path'

import { Break } from '@components/Break'
import { Experience } from '@components/Experience'
import { ItsaMe } from '@components/ItsaMe'
import { components } from '@components/MDXComponents'
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

export default function Home({ code }: Props) {
  const Component = useMemo(() => getMDXComponent(code), [code])

  return (
    <article className='max-w-[75ch] mx-auto pt-12 pb-28 px-5'>
      <Component components={mdxComponents} />
    </article>
  )
}
