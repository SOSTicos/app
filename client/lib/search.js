import Fuse from 'fuse.js'

const searches = {}

export default (keys = [], options) => {
  const id = 'search_' + keys.join('-')

  if (searches[id]) return searches[id]

  const settings = {
    threshold: 0.1,
    location: 0,
    distance: 0,
    minMatchCharLength: 1,
    findAllMatches: false,
    shouldSort: true,
    ...options,
  }

  const fuse = new Fuse([], { ...settings, keys })

  searches[id] = (data, term) => {
    fuse.setCollection(data)
    return fuse.search(term).map((item) => item.item)
  }

  return searches[id]
}
