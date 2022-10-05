import { ItsaMe } from './ItsaMe'

export const About: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className='flex-row-reverse gap-4 md:flex'>
    <ItsaMe />
    <div>{children}</div>
  </div>
)
