/* eslint-disable @next/next/no-css-tags */
import Head from 'next/head'
import { NextSeo } from 'next-seo'

import { NavSidebar } from '@components/navigation/NavSidebar'
import { parseDate } from '@utils/date'
import { formatTags } from '@utils/tags'

import { Tag } from './Tag'

type Props = {
  meta: ContentMeta
  toc: { id: string; text: string }[]
  children?: React.ReactNode
}

export const ContentPage: React.FC<Props> = ({ meta, toc, children }) => {
  const datetime = parseDate(meta.date)

  return (
    <>
      <NextSeo
        title={meta.title}
        description={meta.description}
        canonical={`https://www.philip-chan.me/posts/${meta.slug}`}
        openGraph={{ url: `https://www.philip-chan.me/posts/${meta.slug}` }}
        additionalMetaTags={[
          { name: 'twitter:title', content: meta.title },
          { name: 'twitter:description', content: meta.description },
        ]}
      />
      <Head>
        <link rel='stylesheet' href='/styles/prism.css' />
        <link
          rel='preload'
          href='/fonts/fira-code/fira-code-v9-latin-regular.woff'
          as='font'
          crossOrigin=''
          type='font/woff'
        />
        <link
          rel='preload'
          href='/fonts/fira-code/fira-code-v9-latin-regular.woff2'
          as='font'
          crossOrigin=''
          type='font/woff2'
        />
      </Head>
      <article className='max-w-[100ch] mx-auto pt-12 pb-28 px-5'>
        <div className='pb-8'>
          <h1 className='mb-1 text-3xl font-black capitalize md:text-4xl'>{meta.title}</h1>
          <p className='italic mt-0'>
            <small>{meta.description}</small>
          </p>
          <div className='flex flex-col	pt-1 pb-0 text-sm font-thin uppercase text-stone-500 dark:text-stone-400'>
            <time dateTime={datetime.tag}>{datetime.full}</time>
            {meta.lastUpdateDate ? (
              <time dateTime={datetime.tag}>Last updated on {parseDate(meta.lastUpdateDate).full}</time>
            ) : null}
          </div>
          {formatTags(meta.tags).map((tag: string, index: number) => (
            <Tag key={index} tag={tag}></Tag>
          ))}
        </div>
        <div className='grid grid-cols-5 grid-rows-1 gap-6'>
          <div className='col-span-5 md:col-span-4 '>{children}</div>
          <div className='hidden md:block'>{toc?.length > 1 && <NavSidebar toc={toc} />}</div>
        </div>
      </article>
    </>
  )
}
