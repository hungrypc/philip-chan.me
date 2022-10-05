import { useMemo } from 'react'

import { getMDXComponent } from 'mdx-bundler/client'
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

import { ContentPage } from '@components/content'
import { components } from '@components/MDXComponents'
import { getAllNotesMeta, getNote } from '@utils/loadMDX'

export const getStaticPaths = async () => {
  const notes = await getAllNotesMeta()
  const paths = notes.map(({ slug }) => ({ params: { slug } }))

  return { paths, fallback: false }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const slug = context.params?.slug as string
  const note = await getNote(slug)

  return { props: note }
}

type Props = InferGetStaticPropsType<typeof getStaticProps>

export const Note: React.FC<Props> = ({ meta, toc, code }) => {
  const Component = useMemo(() => getMDXComponent(code), [code])

  return (
    <ContentPage meta={meta} toc={toc}>
      <Component components={components} />
    </ContentPage>
  )
}

export default Note
