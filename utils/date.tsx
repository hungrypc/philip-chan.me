import React from 'react'

import { DateTime } from 'luxon'

export const parseDate = (date: string) => {
  const parsed = DateTime.fromJSDate(new Date(date))
  let dateTime

  if (parsed.isValid) {
    dateTime = parsed
  } else {
    dateTime = { toFormat: () => date }
  }

  return {
    full: dateTime.toFormat('DD'),
    short: <span>{dateTime.toFormat('LL/yy')}</span>,
    semi: dateTime.toFormat('LLL dd'),
    tag: (parsed.isValid ? parsed : DateTime.local()).toFormat('yyyy-LL-dd'),
  }
}
