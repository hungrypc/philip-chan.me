import { ItsaMe } from './ItsaMe'

export const About: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className='gap-4 md:flex flex-row-reverse'>
    <ItsaMe />
    <div>{children}</div>
  </div>
)
