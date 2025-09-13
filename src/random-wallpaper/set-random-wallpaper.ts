export function setRandomWallpaper() {
  const classes = [
    'abyss-watchers',
    'warrior-slash',
    'messmer',
    'bloodborne',
    '',
    'soul-of-cinder',
    'radanh-malenia',
    'gascoigne',
    'artorias',
    'wilder',
    'erdtree',
    'crimson-moon',
    'scadutree',
    'ds1-bonfire',
  ]

  const index = Math.floor(Math.random() * classes.length)

  if(!classes[index]) return

  document.querySelector('.background')!.className = `background ${classes[index]}`
}

const fiveMinutesInMS = 300_000
setInterval(setRandomWallpaper, fiveMinutesInMS)
