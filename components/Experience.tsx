import { parseDate } from '@utils/date'

const experience = [
  {
    company: 'Guiker',
    location: 'remote',
    position: 'Full-stack Software Developer',
    startDate: 'Jul 2020',
    endDate: 'present',
    details: (
      <>
        <p>
          Guiker is a software platform on which tenants and landlords are able to connect, sign relevant documents, and
          pay/receive rent throughout the lease term. Responsibilities include project ownership, implementation and
          maintanence of various (micro) services, building user interface and component library, and product-ops
          support.
        </p>
        <p>Stack: React, TypeScript, AWS, MongoDB, MySQL</p>
      </>
    ),
  },
]

export const Experience: React.FC = () => (
  <ul>
    {experience.map(({ company, details, endDate, position, startDate }) => {
      const [parsedStartDate, parsedEndDate] = [parseDate(startDate), parseDate(endDate)]
      return (
        <li key={company} className='pb-2 pl-0 mb-4 border-b dark:border-stone-900 border-stone-200 before:contents'>
          <section>
            <h3 className='m-0 text-base font-normal'>{position}</h3>
            <div>
              <div className='flex justify-between text-sm text-stone-600 dark:text-stone-400 '>
                <div>{company}</div>
                <div>
                  <time dateTime={parsedStartDate.tag}>{parsedStartDate.short}</time>
                  {' - '}
                  <time dateTime={parsedEndDate.tag}>{parsedEndDate.short}</time>
                </div>
              </div>
              <p className='mt-4 text-sm'>{details}</p>
            </div>
          </section>
        </li>
      )
    })}
  </ul>
)
