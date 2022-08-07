import ExportedImage from 'next-image-export-optimizer'

export const ItsaMe: React.FC = () => (
  <div className='max-w-xl mx-auto'>
    <ExportedImage
      className='z-10'
      src='images/me.jpg'
      alt='picture of me'
      placeholder='blur'
      objectFit='contain'
      priority
    />
  </div>
)
