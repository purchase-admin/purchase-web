const defaultSettings = require('@/settings.js')
console.log(defaultSettings.title)

const title = defaultSettings.title || '阳光采购系统'


export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
