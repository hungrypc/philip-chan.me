import { parseDate } from '@utils/date'

const experience = [
  {
    company: 'Shippie',
    position: 'Sr. Software Engineer (full-stack)',
    startDate: 'Nov/2024',
    endDate: 'Present',
    details: (
      <p>
        Worked on functionalities for the platform that enabled users to manage their shipping and logistics needs.
        Features include third-party e-commerce API integrations, re-building billing system, bulk import packages via
        label scanner with text-recognition. Overseeing and conducting full migration of legacy system to new
        architecture whilst continuing to develop current services for client needs.
      </p>
    ),
    stack: 'Typescript, Nodejs, React, GCloud, Firebase, PostgreSQL',
  },
  {
    company: 'Yoop',
    position: 'Software Engineer (backend)',
    startDate: 'Dec/2022',
    endDate: 'Present',
    details: (
      <p>
        Designed architecture and implemented system migration for multi-region data management, compliant with GDPR to
        enable expansion into Europe. Improved infrastructure tools, resulting in quicker disaster recovery response
        time and a simplified process for cross-region deployment. Built automated system to scale resources based on
        custom metrics specifically designed within the context of ticketing, making resource management efficient and
        cost-effective.
      </p>
    ),
    stack: 'Java, Spring, Terraform, AWS, Redis, MySQL',
  },
  {
    company: 'Guiker',
    position: 'Software Developer (full-stack)',
    startDate: 'Jul/2020',
    endDate: 'Nov/2022',
    details: (
      <p>
        Worked on the consumer app that enabled tenants and landlords to connect. Built and managed features for chat
        platform, rental listing management, booking system, document signing, and payment transaction management.
        Contributed to internal tools for building and deploying services.
      </p>
    ),
    stack: 'TypeScript, React, AWS, MongoDB, MySQL',
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
              <time dateTime={parsedEndDate.tag}>{parsedEndDate.short}</time>
              <div className='sm:leading-4'>{'|'}</div>
              <time dateTime={parsedStartDate.tag}>{parsedStartDate.short}</time>
            </div>
            <div>
              <h3 className='m-0 mb-1 text-base font-semibold'>{position}</h3>
              <div className='text-sm text-stone-600 dark:text-stone-400'>@ {company}</div>
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
