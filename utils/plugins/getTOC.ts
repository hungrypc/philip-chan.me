import { visit } from 'unist-util-visit'

interface HtmlElementNode {
  type: string
  tagName: string
  value: string
  properties: { id: string }
  children?: HtmlElementNode[]
}

// @TODO build out plugin for subheader
const headings = ['h2']

export const getTOC = (toc: { id: string; text: string }[], shouldRenderTOC: boolean) => () => {
  return (tree: HtmlElementNode) => {
    if (shouldRenderTOC) {
      visit(tree, 'element', (node: HtmlElementNode) => {
        if (headings.includes(node.tagName)) {
          const id = node.properties.id
          const text = (node.children ?? []).find(child => child.type === 'text')?.value
          text && toc.push({ id, text })
        }
      })
    }
    return
  }
}
