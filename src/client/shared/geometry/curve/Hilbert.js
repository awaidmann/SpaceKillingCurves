import Morton from './Morton'

export default class Hilbert extends Morton {
  constructor(geohash, origin) {
    super(geohash, origin)

    // adapted from: http://blog.notdot.net/2009/11/Damn-Cool-Algorithms-Spatial-indexing-with-Quadtrees-and-Hilbert-Curves
    // [<Configuation index> [<Z-order quad>  [<Hilbert value>, <Next Configuation index>]]]
    this._ROTATION_MAP = {
      "a": [[[0, 0], "b"], [[0, 1], "a"], [[1, 1], "c"], [[1, 0], "a"]],
      "b": [[[0, 0], "a"], [[1, 1], "d"], [[0, 1], "b"], [[1, 0], "b"]],
      "c": [[[1, 0], "c"], [[0, 1], "c"], [[1, 1], "a"], [[0, 0], "d"]],
      "d": [[[1, 0], "d"], [[1, 1], "b"], [[0, 1], "d"], [[0, 0], "c"]],
    }
  }

  quadrantForPoint(point, threshold) {
    function hilbertFromMortonQuad(zOrder, parentQuad) {
      if (zOrder.length >= 2) {
        var quadSlice = zOrder.slice(0, 2)
        var quadNumeral = (quadSlice[0] << 1) | quadSlice[1]

        var nextQuadMap = this._ROTATION_MAP[parentQuad][quadNumeral]
        return nextQuadMap[0].concat(hilbertFromMortonQuad(zOrder.slice(2), nextQuadMap[1]))
      }

      return []
    }

    // call super type (Morton) method and then transform Morton encoding to Hilbert encoding
    var zOrderQuad = super.quadrantForPoint(point, threshold)
    return zOrderQuad ? hilbertFromMortonQuad(zOrderQuad, "b") : undefined
  }

  quadrantRangesForSearch(viewRect, maxRanges) {}
}
