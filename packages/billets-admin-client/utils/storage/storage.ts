import { StorageItem } from './types'

const storage = {
  set: function (item: StorageItem, value: string) {
    localStorage.setItem(item, value)
  },
  get: function <ParsedValueT>(item: StorageItem) {
    const value = localStorage.getItem(item)
    try {
      if (!value) return null
      const parsed = JSON.parse(value) as ParsedValueT
      return parsed
    } catch (e) {
      if (typeof value === 'string') return value as string
      return null
    }
  },
  remove: function (item: StorageItem) {
    localStorage.removeItem(item)
  },
  clear: function () {
    localStorage.clear()
  },
}

export default storage
