import { DefaultSeo } from 'next-seo'

export const SEO: React.FC = () => (
  <DefaultSeo
    title="Phil Chan's site"
    description='Full-stack developer and serial hobbyist.'
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
