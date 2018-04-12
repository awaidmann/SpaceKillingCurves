'use strict'

var mockData = Promise.resolve([])
var mockOrigin = Promise.resolve()

function getOrigin() {
  return mockOrigin
}

function setOrigin(o) {
  mockOrigin = Promise.resolve(o)
  return mockOrigin
}

function getStrokes() {
  // fetch from db
  return mockData
}

function setNextStrokes(beziers) {
  mockData = mockData.then(prev => {
    // save to db
    return getOrigin()
      .then(o => !o && prev.length ? setOrigin(prev[0].start) : Promise.resolve(o))
      .then(o => {
        return beziers
          ? prev.concat(beziers.map(
            b => {
              return Object.assign({
                morton: (new Morton(GeoHash.default(), o))
                  .quadrantForBezier(b),
                hilbert: (new Hilbert(GeoHash.default(), o))
                  .quadrantForBezier(b)
              }, b)
            }))
          : prev
      })
  })
  return mockData
}
