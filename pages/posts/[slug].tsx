import { useMemo } from 'react'

import { getMDXComponent } from 'mdx-bundler/client'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

import { PostPage } from '@components/content'
import { components } from '@components/MDXComponents'
import { getAllPostsMeta, getPost } from '@utils/loadMDX'

export const getStaticPaths = async () => {
  const posts = await getAllPostsMeta()
  const paths = posts.map(({ slug }) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const slug = context.params?.slug as string
  const post = await getPost(slug)

  return { props: post }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const Post: React.FC<Props> = ({ meta, code }) => {
  const Component = useMemo(() => getMDXComponent(code), [code])
  return (
    <PostPage meta={meta}>
      <Component components={{ ...components }} />
    </PostPage>
  )
}

export default Post
