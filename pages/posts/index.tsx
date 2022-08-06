import { InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'

import { PostPreviewList } from '@components/PostPreviewList'
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
      <div className='w-full sm:max-w-[75ch] m-auto px-5 py-16 flex flex-col justify-center items-center'>
        <PostPreviewList posts={posts} />
      </div>
    </>
  )
}

export default Posts
