import { useRouter } from 'next/router'

import { useTags } from './TagsContext'

type TagProps = {
  tag: string
  count?: number
}

type TagListProps = {
  postTagCountMap: Record<string, number>
}

export const Tag: React.FC<TagProps> = ({ tag, count }) => {
  const { tags, toggleTags, resetTags } = useTags()
  const isSelected = tags.has(tag)
  const router = useRouter()
  const isInPosts = router.asPath.includes('posts/')
  const isInNotes = router.asPath.includes('notes/')
  const isIsPreviewList = !isInPosts && !isInNotes

  return (
    <small
      className={!isSelected || !isIsPreviewList ? `link-tag` : 'link-tag-selected'}
      style={{ margin: '12px 12px 0 0', display: 'inline-block', cursor: 'pointer' }}
      onClick={() => {
        if (isInPosts) {
          router.push('/posts')
          resetTags()
        } else if (isInNotes) {
          router.push('/notes')
          resetTags()
        }
        toggleTags(tag)
      }}
    >
      {tag}
      {count && ` (${count})`}
    </small>
  )
}

export const TagList: React.FC<TagListProps> = ({ postTagCountMap }) => {
  const tags: JSX.Element[] = []
  Object.keys(postTagCountMap).forEach(tag => {
    tags.push(<TagListItem tag={tag} count={postTagCountMap[tag]} />)
  })

  return (
    <div className='mb-10 self-start'>
      <h2 className='pl-1 text-lg font-semibold'>tags:</h2>
      <ul>{tags}</ul>
    </div>
  )
}

export const TagListItem: React.FC<MarkRequired<TagProps, 'count'>> = ({ tag, count }) => (
  <span>
    <Tag tag={tag} count={count} />
  </span>
)

export const ResetTagsButton: React.FC = () => {
  const { resetTags } = useTags()
  return (
    <div className='my-8'>
      <button className={`link-tag`} onClick={resetTags}>
        reset tags
      </button>
    </div>
  )
}
