import { m } from 'framer-motion'

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
}

export const AnimateLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <m.div initial='hidden' animate='enter' exit='exit' variants={variants}>
      {children}
    </m.div>
  )
}
