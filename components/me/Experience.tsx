import { parseDate } from '@utils/date'

const experience = [
  {
    company: 'Guiker',
    position: 'Full-stack Software Developer',
    startDate: 'Jul/2020',
    endDate: 'Nov/2022',
    details: (
      <p>
        Guiker is a software platform on which tenants and landlords are able to connect, sign relevant documents, and
        pay/receive rent throughout the lease term. Responsibilities include project ownership, implementation and
        maintanence of various (micro) services, building out product interface, and assisting in product-ops support.
      </p>
    ),
    stack: 'React, TypeScript, AWS, MongoDB, MySQL',
  },
  {
    company: 'Yoop',
    position: 'Backend Software Engineer',
    startDate: 'Dec/2022',
    endDate: 'Present',
    details: (
      <p>
        Yoop is a platform that offers the event experience with ticketing solutions for fans through video attendance
        and e-solution, replacing tickets with tokens, releasing a robust suite creator tools, streamlining event
        inventory distribution, and building the first trusted and transparent fan journey.
      </p>
    ),
    stack: 'Spring, Java, AWS, Redis, MySQL',
  },
]

export const Experience: React.FC = () => (
  <ul>
    {experience.map(({ company, details, endDate, position, stack, startDate }) => {
      const [parsedStartDate, parsedEndDate] = [parseDate(startDate), parseDate(endDate)]
      return (
        <li key={company} className='mb-4 border-b border-stone-200 pb-2 pl-0 before:contents dark:border-stone-900'>
          <section className='flex flex-col justify-between gap-1 sm:flex-row sm:gap-6'>
            <div className='flex gap-1 text-center text-sm text-stone-600 dark:text-stone-400 sm:flex-col sm:gap-0 sm:pl-1 sm:pt-1'>
              <time dateTime={parsedStartDate.tag}>{parsedStartDate.short}</time>
              <div className='sm:leading-4'>{'-'}</div>
              <time dateTime={parsedEndDate.tag}>{parsedEndDate.short}</time>
            </div>
            <div>
              <h3 className='m-0 mb-1 text-base font-semibold'>{position}</h3>
              <div className='text-sm text-stone-600 dark:text-stone-400'>{company}</div>
              <div className='mt-4 text-sm'>
                {details}
                <p className='italic text-stone-600 dark:text-stone-400'>Stack: {stack}</p>
              </div>
            </div>
          </section>
        </li>
      )
    })}
  </ul>
)
