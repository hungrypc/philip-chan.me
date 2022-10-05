import { InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'

import { ContentPreviewList } from '@components/content'
import { getAllPostsMeta } from '@utils/loadMDX'

export const getStaticProps = async () => {
  const posts = await getAllPostsMeta()

  return { props: { posts } }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

const Posts: React.FC<Props> = ({ posts }) => {
  return (
    <>
      <NextSeo
        title='Posts'
        canonical='https://philip-chan.me/posts'
        openGraph={{ url: 'https://philip-chan.me/posts' }}
      />
      <div className='m-auto flex w-full flex-col items-center justify-center px-5 py-16 sm:max-w-[100ch]'>
        <ContentPreviewList posts={posts} />
      </div>
    </>
  )
}

export default Posts
