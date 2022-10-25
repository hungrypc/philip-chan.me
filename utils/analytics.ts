import { safelyGetWindow } from './safely-get-window'

export enum AnalyticEventType {
  PAGE_VIEW = 'PAGE_VIEW',
}

type AnalyticEvent = {
  domain: string
  eventType: AnalyticEventType
  referer: string
  url: string
  clientWidth: number
}

type EventOptions = {
  url?: string
  callback?: () => void
}

export const triggerEvent = (eventType: AnalyticEventType, options?: EventOptions) => {
  if (/^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(location.hostname) || location.protocol === 'file:')
    return console.warn('localhost')

  const safeWindow = safelyGetWindow()
  if (!safeWindow) return console.warn('window undefined')

  const endpoint = 'https://api.philip-chan.me/analytics-service/public/analytics/event'

  const payload: AnalyticEvent = {
    domain: 'philip-chan.me',
    eventType,
    referer: safeWindow.document.referrer,
    url: options && options.url ? options.url : safeWindow.location.href,
    clientWidth: safeWindow.innerWidth,
  }

  const request = new XMLHttpRequest()
  request.open('POST', endpoint, true)
  request.setRequestHeader('Content-Type', 'text/plain')

  request.send(JSON.stringify(payload))

  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      options && options.callback && options.callback()
    }
  }
}
