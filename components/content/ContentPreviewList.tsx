import Link from 'next/link'
import { useRouter } from 'next/router'

import { parseDate } from '@utils/date'
import { formatTags } from '@utils/tags'

import { ResetTagsButton, Tag, TagList, useTags } from './'

export const ContentPreview: React.FC<ContentMeta> = ({ slug, title, date, tags }) => {
  const router = useRouter()
  const datetime = parseDate(date)

  return (
    <li className='my-8'>
      <Link href={`${router.asPath}/${slug}`}>
        <a className='flex items-center p-1 capitalize transition-colors duration-200 rounded outline-none'>
          <p className='text-sm mr-8 min-w-[50px]'>
            <time dateTime={datetime.tag}>{datetime.semi}</time>
          </p>
          <h3 className='font-light link-btn'>{title}</h3>
        </a>
      </Link>
      {formatTags(tags).map((tag, index) => (
        <Tag key={index} tag={tag} />
      ))}
    </li>
  )
}

export const ContentPreviewList: React.FC<{ posts: ContentMeta[] }> = ({ posts }) => {
  const { tags: selectedTags } = useTags()
  const showAllPosts = selectedTags.size === 0
  const postTagCountMap = posts.reduce((tagCountMap, post) => {
    formatTags(post.tags).forEach(tag => (tagCountMap[tag] = (tagCountMap[tag] ?? 0) + 1))
    return tagCountMap
  }, {} as { [key: string]: number })

  const fileredPosts = showAllPosts
    ? posts
    : posts.filter(post => {
        const postTagSet = new Set(formatTags(post.tags))
        return Array.from(selectedTags).every(selectedTag => postTagSet.has(selectedTag))
      })

  if (!showAllPosts && fileredPosts.length === 0) {
    return (
      <>
        <TagList postTagCountMap={postTagCountMap} />
        <ResetTagsButton />
      </>
    )
  }

  const postsByYear: Record<string, ContentMeta[]> = {}

  fileredPosts.forEach(post => {
    const year = new Date(post.date).getFullYear()
    const knownPosts = postsByYear[year] || []
    postsByYear[year] = [...knownPosts, post]
  })

  return (
    <>
      <TagList postTagCountMap={postTagCountMap} />
      {Object.entries(postsByYear)
        .reverse()
        .map(([year, posts]) => {
          return (
            <div key={year} className='w-full'>
              <h2 className='pl-1 text-lg font-semibold'>{year}</h2>
              <ul>
                {posts.map(post => {
                  return <ContentPreview key={post.slug} {...post} />
                })}
              </ul>
            </div>
          )
        })}
    </>
  )
}
