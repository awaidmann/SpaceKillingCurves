function normalize(p, t) {
  return t ? Object.assign({}, p, { x: (p.x - t.x)/t.k, y: (p.y - t.y)/t.k }) : p
}

function invertNormalize(p, t) {
  return t ? Object.assign({}, p, { x: (p.x*t.k + t.x), y: (p.y*t.k + t.y) }) : p
}
