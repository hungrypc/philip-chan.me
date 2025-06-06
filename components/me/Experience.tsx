import { parseDate } from '@utils/date'

const experience = [
  {
    company: 'UniUni',
    position: 'Sr. Software Engineer (full-stack)',
    startDate: 'Mar/2025',
    endDate: 'Present',
    details: (
      <p>
        Designed and built backend infrastructure tools from the ground up to support rapid development, enabling a
        newly formed team to launch a production-ready platform within two months. Architected and delivered core
        functionalities, including general shipment management, payment processing workflows, a closed-loop wallet
        credits system, transaction ledger, modular billing engine, and automated order synchronization with third-party
        integrations (e.g. Shopify).
      </p>
    ),
    stack: 'Typescript, Nodejs, Nextjs, AWS, Prisma/GraphQL, PostgreSQL',
  },
  {
    company: 'Shippie',
    position: 'Sr. Software Engineer (full-stack)',
    startDate: 'Nov/2024',
    endDate: 'Present',
    details: (
      <p>
        Developed utility features to support internal logistical operations and enhanced backend observability to
        enable faster incident resolution. Integrated various third-party APIs, restructured the billing system, and
        built a text-recognition label scanner to streamline order transfers from partnered services. Currently
        maintaining and adapting these systems as the company transitions to a new business model.
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
        Designed architecture and coordinated system migration for multi-region data management compliant with GDPR to
        enable expansion into Europe. Improved infrastructure tools, resulting in quicker disaster recovery response
        time and a simplified process for cross-region deployment. Implemented automated system to scale resources based
        on custom metrics designed around the context of ticketing, making resource management efficient and
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
          <section className='flex flex-col items-start justify-between gap-1 sm:flex-row sm:gap-6'>
            <div className='flex flex-row-reverse gap-1 text-center text-sm text-stone-600 dark:text-stone-400 sm:flex-col sm:gap-0 sm:pl-1 sm:pt-1'>
              <time dateTime={parsedEndDate.tag}>{parsedEndDate.short}</time>
              <div className='rotate-90 sm:rotate-0 sm:leading-4'>{'|'}</div>
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
