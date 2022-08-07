/* eslint-disable jsx-a11y/alt-text */
import Image, { ImageProps } from 'next/image'
import Link from 'next/link'

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
      <Image {...(props as ImageProps)} layout='fill' />
    </div>
  ),
}
