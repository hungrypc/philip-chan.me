import { InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'

import { PostPreviewList } from '@components/PostPreviewList'
import { getAllNotesMeta } from '@utils/loadMDX'

export const getStaticProps = async () => {
  const notes = await getAllNotesMeta()
  return { props: { notes } }
}
type Props = InferGetStaticPropsType<typeof getStaticProps>

const Notes: React.FC<Props> = ({ notes }) => {
  return (
    <>
      <NextSeo
        title='Notes'
        canonical='https://philip-chan.me/notes'
        openGraph={{ url: 'https://philip-chan.me/notes' }}
      />

      <div className='w-full sm:max-w-[75ch] m-auto px-5 py-16 flex flex-col justify-center items-center'>
        <PostPreviewList posts={notes} />
      </div>
    </>
  )
}

export default Notes
