import { InferGetStaticPropsType } from 'next'
import { NextSeo } from 'next-seo'

import { ContentPreviewList } from '@components/content'
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

      <div className='m-auto flex w-full flex-col items-center justify-center px-5 py-16 sm:max-w-[100ch]'>
        <ContentPreviewList posts={notes} />
      </div>
    </>
  )
}

export default Notes
