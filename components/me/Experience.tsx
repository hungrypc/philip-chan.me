import { parseDate } from '@utils/date'

const experience = [
  {
    company: 'Guiker',
    location: 'remote',
    position: 'Full-stack Software Developer',
    startDate: 'Jul 2020',
    endDate: 'Present',
    details: (
      <p>
        Guiker is a software platform on which tenants and landlords are able to connect, sign relevant documents, and
        pay/receive rent throughout the lease term. Responsibilities include project ownership, implementation and
        maintanence of various (micro) services, building user interface and component library, and product-ops support.
      </p>
    ),
    stack: 'React, TypeScript, AWS, MongoDB, MySQL',
  },
]

export const Experience: React.FC = () => (
  <ul>
    {experience.map(({ company, details, endDate, position, stack, startDate }) => {
      const [parsedStartDate, parsedEndDate] = [parseDate(startDate), parseDate(endDate)]
      return (
        <li key={company} className='pb-2 pl-0 mb-4 border-b dark:border-stone-900 border-stone-200 before:contents'>
          <section className='flex justify-between gap-6'>
            <div className='flex flex-col text-center pl-1 text-sm text-stone-600 dark:text-stone-400'>
              <time dateTime={parsedStartDate.tag}>{parsedStartDate.short}</time>
              <span>{' - '}</span>
              <time dateTime={parsedEndDate.tag}>{parsedEndDate.short}</time>
            </div>
            <div className='max-w-11/12'>
              <h3 className='m-0 mb-1 text-base font-semi-bold'>{position}</h3>
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
