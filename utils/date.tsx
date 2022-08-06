import { format, localeFormat } from 'light-date'

const tagFmt = 'yyyy-MM-dd'

export const parseDate = (d: string) => {
  const date = new Date(d)
  const isValid = date instanceof Date && !isNaN(Date.parse(d))
  let fmtr

  if (isValid) {
    fmtr = (f: string) => {
      const parsedFmt = f.replace(/([a-zA-Z]{1,})/g, (substr: string) => {
        const parsedStr = `{${substr}}`
        return /[M]{3}/.test(substr) ? localeFormat(date, parsedStr) : parsedStr
      })
      return format(date, parsedFmt)
    }
  } else {
    fmtr = () => d
  }

  return {
    full: fmtr('MMM dd, yyyy'),
    short: <span>{fmtr('MM/yy')}</span>,
    semi: fmtr('MMM dd'),
    tag: isValid ? fmtr(tagFmt) : format(new Date(), tagFmt),
  }
}
