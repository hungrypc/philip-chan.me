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
          Building and improving a software product in which tenants and landlords are able to connect, sign relevant
          documents, and pay/receive rent throughout the lease term. Responsibilities include project planning (task
          breakdowns), implementation and maintanence of various (micro) services on backend, building out library and
          applying component solutions for front-end, and assisting in product-ops support.
        </p>
        <p>Tech stack: React, TypeScript, AWS, MongoDB, MySQL</p>
      </>
    ),
  },
]

export function Experience() {
  return (
    <ul>
      {experience.map(({ company, details, endDate, position, startDate }) => {
        const [parsedStartDate, parsedEndDate] = [parseDate(startDate), parseDate(endDate)]
        return (
          <li
            key={company}
            className='pb-2 pl-0 mb-4 border-b dark:border-warmGray-900 border-warmGray-200 before:contents'
          >
            <section>
              <h3 className='m-0 text-base font-normal'>{position}</h3>
              <div>
                <div className='flex justify-between text-sm text-warmGray-600 dark:text-warmGray-400 '>
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
}
