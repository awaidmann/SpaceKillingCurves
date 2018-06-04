import { Set, Seq } from 'immutable'

export default class QueryCache {
  constructor(cacheKeys, cache, accessor, searchComparator, sortComparator) {
    this.cacheKeys = Set(cacheKeys || [])
    this.cache = new Seq.Indexed(cache || [])
    this.accessor = accessor || (x => x)
    this.searchComparator = searchComparator || ((a, b) => a <= b ? 1 : -1)
    this.sortComparator = sortComparator
  }

  add(key, toInsert) {
    return this.cacheKeys.has(key)
      ? this
      : new QueryCache(
          this.cacheKeys.add(key),
          insertIntoCache(
            new Seq.Indexed(toInsert),
            this.cache,
            this.accessor,
            this.searchComparator,
            this.sortComparator
          ),
          this.accessor,
          this.searchComparator,
          this.sortComparator)
  }

  get(key) {
    return this.cacheKeys.has(key)
      ? getFromCache(
          key,
          this.cache,
          this.accessor,
          this.searchComparator,
          this.sortComparator
        ).toArray()
      : []
  }

  has(key) {
    return this.cacheKeys.has(key)
  }
}

function insertIntoCache(toInsert, cache, accessor, searchComparator, sortComparator) {
  if (toInsert.isEmpty()) return cache

  const toInsertSorted = toInsert.sortBy(accessor, sortComparator)
  const searchCompare = (searchVal, index, bias) => searchComparator(searchVal, accessor(cache.get(index)), bias)
  const insertStart = rangeBinarySearch(
    accessor(toInsertSorted.first()),
    subtreeComparator(searchCompare),
    0, cache.size, -1)

  const insertEnd = rangeBinarySearch(
    accessor(toInsertSorted.last()),
    subtreeComparator(searchCompare),
    0, cache.size, 1)

  return cache
    .slice(0, insertStart)
    .concat(toInsertSorted)
    .concat(cache.slice(insertEnd))
}

function getFromCache(key, cache, accessor, searchComparator, sortComparator) {
  const searchCompare = (searchVal, index, bias) => searchComparator(searchVal, accessor(cache.get(index)), bias)

  return cache.slice(
    rangeBinarySearch(key, subtreeComparator(searchCompare), 0, cache.size, -1),
    rangeBinarySearch(key, subtreeComparator(searchCompare), 0, cache.size, 1)
  )
}


function subtreeComparator(comparator) {
  return (searchVal, index, matchBias = 0) => comparator(searchVal, index) || matchBias
}

function rangeBinarySearch(searchVal, subtree, start, end, matchBias) {
  function rangeBinarySearchRec(s, e) {
    if (s === e) return s
    if (s+1 === e) {
      const sPivot = subtree(searchVal, s, matchBias)
      const ePivot = subtree(searchVal, e, matchBias)
      return sPivot === ePivot
        ? matchBias <= 0 ? s : e
        : sPivot === matchBias ? s : e
    }
    const pivot = Math.floor((s + e) / 2)
    const branch = subtree(searchVal, pivot, matchBias)
    return branch === 0
      ? pivot
      : branch < 0
        ? rangeBinarySearchRec(s, pivot)
        : rangeBinarySearchRec(pivot, e)
  }

  return rangeBinarySearchRec(start, end)
}
