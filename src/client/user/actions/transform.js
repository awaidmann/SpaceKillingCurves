export const TRANSFORM = 'TRANSFORM'
export const RESIZE = 'RESIZE'
export const TRANSFORM_COMPLETE = 'TRANSFORM_COMPLETE'

export function transform(transform) {
  return { type: TRANSFORM, transform }
}

export function resize(dimensions) {
  return { type: RESIZE, dimensions }
}

export function transformComplete(transform, dimensions, viewPrefixes) {
  return { type: TRANSFORM_COMPLETE, transform, dimensions, viewPrefixes }
}
