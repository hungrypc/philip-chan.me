import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='max-w-[75ch] mx-auto py-12 px-5 flex flex-col gap-8 justify-center items-center'>
      <h1 className='text-3xl'>404</h1>
      <p>oof, soz</p>
      <Link href='/'>
        <a className='link-btn'>go home</a>
      </Link>
    </div>
  )
}
