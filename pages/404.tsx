import Link from 'next/link'

const NotFound: React.FC = () => (
  <div className='mx-auto flex max-w-[75ch] flex-col items-center justify-center gap-8 py-12 px-5'>
    <h1 className='text-3xl'>404</h1>
    <p>oof, soz</p>
    <Link href='/'>
      <a className='link-btn'>go home</a>
    </Link>
  </div>
)

export default NotFound
