import { Set, Seq, List, isImmutable } from 'immutable'

export default class QueryCache {
  constructor(cacheKeys, cache, accessor, searchComparator, sortComparator) {
    this.cacheKeys = isImmutable(cacheKeys) ? cacheKeys : Set(cacheKeys || [])
    this.cache = isImmutable(cache) ? cache : new Seq.Indexed(cache || [])
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

  getFromKeys(keys) {
    return (new Seq.Indexed(keys || []))
      .map(key => getFromCache(key, this.cache, this.accessor, this.searchComparator, this.sortComparator))
      .sortBy(range => range.start)
      .reduce((ranges, range) => {
        const last = ranges.last()
        if (last && range.start <= last.end+1) {
          return ranges.pop().push({ start: last.start, end: Math.max(last.end, range.end) })
        }
        return ranges.push(range)
      }, List())
      .flatMap(range => this.cache.slice(range.start, range.end))
      .toArray()
  }

  has(key) {
    return this.cacheKeys.some(k => key.startsWith(k))
  }
}

function insertIntoCache(toInsert, cache, accessor, searchComparator, sortComparator) {
  if (toInsert.isEmpty()) return cache

  const toInsertSorted = toInsert.sortBy(accessor, sortComparator)
  const searchCompare = (searchVal, index) => searchComparator(searchVal, accessor(cache.get(index)))
  const insertStart = rangeBinarySearch(
    accessor(toInsertSorted.first()), searchCompare, 0, cache.size, -1)
  const insertEnd = rangeBinarySearch(
    accessor(toInsertSorted.last()), searchCompare, 0, cache.size, 1)

  return cache
    .slice(0, insertStart + 1)
    .concat(toInsertSorted)
    .concat(cache.slice(insertEnd))
}

function getFromCache(key, cache, accessor, searchComparator, sortComparator) {
  const searchCompare = (searchVal, index) => searchComparator(searchVal, accessor(cache.get(index)))
  return {
    start: rangeBinarySearch(key, searchCompare, 0, cache.size, -1),
    end: rangeBinarySearch(key, searchCompare, 0, cache.size, 1)
  }
}

function rangeBinarySearch(searchVal, subtree, start, end, matchBias = 0) {
  function rangeBinarySearchRec(s, e) {
    if (s === e) return s
    if (s+1 === e) {
      const sPivot = subtree(searchVal, s) || matchBias
      if (!sPivot) return s

      const ePivot = subtree(searchVal, e) || matchBias
      if (!ePivot) return e

      return matchBias < 0 ? s : e
    }
    const pivot = matchBias <= 0
      ? Math.floor((s + e) / 2)
      : Math.ceil((s + e) / 2)
    const branch = subtree(searchVal, pivot) || matchBias
    return !branch
      ? pivot
      : branch < 0
        ? rangeBinarySearchRec(s, pivot)
        : rangeBinarySearchRec(pivot, e)
  }

  return start < end ? rangeBinarySearchRec(start, end) : 0
}
