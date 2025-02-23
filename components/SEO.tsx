import { DefaultSeo } from 'next-seo'

type Props = {
  title?: string
  description?: string
}

export const SEO: React.FC<Props> = ({ title = 'Phil Chan', description = 'Full-Stack Developer' }) => (
  <DefaultSeo
    title={title}
    description={description}
    openGraph={{
      site_name: 'Philip Chan | philip-chan.me',
    }}
    twitter={{
      handle: '@phlpchn',
      site: '@phlpchn',
      cardType: 'summary_large_image',
    }}
  />
)
