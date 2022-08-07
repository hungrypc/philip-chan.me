/* eslint-disable jsx-a11y/alt-text */
import Link from 'next/link'
import ExportedImage, { ExportedImageProps } from 'next-image-export-optimizer'

export const components = {
  a: ({ href = '', ...props }) => {
    if (href.match(/http|https/)) {
      return <a href={href} className='link-btn' target='_blank' rel='noopener noreferrer' {...props} />
    }
    return (
      <Link href={href} passHref>
        <a className='link-btn' {...props} />
      </Link>
    )
  },
  img: ({ children, ...props }: { children?: React.ReactNode }) => (
    <div className='my-10'>
      <ExportedImage {...(props as ExportedImageProps)} layout='fill' />
    </div>
  ),
}
