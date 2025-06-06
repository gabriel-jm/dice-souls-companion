export function setRandomWallpaper() {
  const classes = [
    'abyss-watchers',
    'warrior-slash',
    'messmer',
    '',
    'soul-of-cinder',
    'radanh-malenia',
    'ds3-dragon',
    'artorias',
    'wilder',
    'erdtree',
    'scadutree',
    'ds1-bonfire',
  ]

  const index = Math.floor(Math.random() * classes.length)

  if(!classes[index]) return

  document.querySelector('.background')?.classList.add(classes[index])
}
