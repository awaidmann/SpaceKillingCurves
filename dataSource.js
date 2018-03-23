'use strict'

var mockData = Promise.resolve([])

function getStrokes() {
  // fetch from db
  return mockData
}

function setNextStrokes(beziers) {
  mockData = mockData.then(prev => {
    // save to db
    return beziers ? prev.concat(beziers) : prev
  })
  return mockData
}
