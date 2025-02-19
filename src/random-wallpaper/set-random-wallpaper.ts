export function setRandomWallpaper() {
  const classes = [
    'warrior-slash',
    '',
    'radanh-malenia',
    'erdtree',
    'messmer',
    'scadutree'
  ]

  const index = Math.floor(Math.random() * classes.length)

  if(!classes[index]) return

  document.querySelector('.background')?.classList.add(classes[index])
}
