import { DefaultSeo } from 'next-seo'

export const SEO: React.FC = () => (
  <DefaultSeo
    title="Phil Chan's site"
    description='Website of Philip Chan, full-stack developer and serial hobbyist.'
    openGraph={{
      site_name: 'philip-chan.me',
    }}
    twitter={{
      handle: '@phlpchn',
      site: '@phlpchn',
      cardType: 'summary_large_image',
    }}
  />
)
