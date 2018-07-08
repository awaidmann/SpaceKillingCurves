export const PATH_APPEND = 'PATH_APPEND'
export const PATH_END = 'PATH_END'
export const PATH_SAVE = 'PATH_SAVE'

export function appendPath(point) {
  return { type: PATH_APPEND, point }
}

export function endPath() {
  return { type: PATH_END }
}

export function savePath(path, authToken) {
  // TODO: do other things like convert to bezier and save
  return { type: PATH_SAVE }
}
