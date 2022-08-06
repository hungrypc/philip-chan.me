export const formatTags = (tags: string) => {
  const formattedTagsArr: string[] = []
  for (const tagStr of tags.split(',')) {
    formattedTagsArr.push(`#${tagStr}`)
  }
  return formattedTagsArr
}
