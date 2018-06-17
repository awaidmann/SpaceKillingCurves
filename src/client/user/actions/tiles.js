import tiles from '../../../../data/spk_mixed_data.json'

export const FETCH_TILES = 'FETCH_TILES'
export const FETCH_TILES_ERROR = 'FETCH_TILES_ERROR'
export const FETCH_TILES_SUCCESS = 'FETCH_TILES_SUCCESS'

// TODO: handle pagination
export function fetchTiles(searchPrefixes) {
  return (dispatch, getState) => {
    dispatch({ type: FETCH_TILES, searchPrefixes })
    // TODO: connect to data source methods
    return Promise.all(
      searchPrefixes.map(prefix => {
        const filtered = tiles.filter(b => b.morton.startsWith(prefix))
        return filtered.length
          ? Promise.resolve(filtered)
            .then(resp => dispatch(fetchTilesSuccess(prefix, resp)))
            .catch(error => dispatch(fetchTilesError(prefix, error)))
          : Promise.resolve()
      }))
  }
}

export function fetchTilesError(prefix, error) {
  return { type: FETCH_TILES_ERROR, prefix, error }
}

export function fetchTilesSuccess(prefix, tiles) {
  return { type: FETCH_TILES_SUCCESS, prefix, tiles }
}
