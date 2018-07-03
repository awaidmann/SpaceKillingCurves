export const EDIT_MODE_BEGIN = 'EDIT_MODE_BEGIN'
export const EDIT_MODE_END = 'EDIT_MODE_END'

export function beginEditMode() {
  return { type: EDIT_MODE_BEGIN }
}

export function endEditMode() {
  return { type: EDIT_MODE_END }
}
