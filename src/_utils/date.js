/* 

  dayjs helpers

  Last updated: 12-16-2020

*/

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const niceDate = (value) => {
  if (value) {
    return dayjs(String(value)).format('MMMM D, YYYY')
  }
}


export const niceDateShort = (value) => {
  if (value) {
    return dayjs(String(value)).format('MMM D, YYYY')
  }
}


export const niceTimeDate = (value) => {
  if (value) {
    return dayjs(String(value)).format('h:mm a, MMM D')
  }
}

export const dateTo = (value) => {

  let monthsDiff = dayjs().diff(String(value), "month"); 
  if (value && monthsDiff < 2) {
    return dayjs().to(dayjs(String(value)))
  }

  // for 2mo+ old dates just return the actual date
  return niceDate(value)
}

export const dateDiff = (value, diff) => {
  if (value) {
    return dayjs().diff(dayjs(String(value)), diff)
  }
}

export const isBefore = (value) => {
  if (value) {
    return dayjs().isBefore(dayjs(String(value))) // is today before the value?
  }
}

export const today = (value) => {
  if (value) {
    return dayjs(today).format('MMMM D, YYYY')
  }
}

export const todayCitation = (value) => {
  if (value) {
    return dayjs(today).format('D MMMM, YYYY')
  }
}

