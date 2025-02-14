export function setRandomWallpaper() {
  const classes = [
    '',
    'warrior-slash',
    'radanh-malenia',
    'erdtree'
  ]

  const index = Math.floor(Math.random() * classes.length)
  document.querySelector('.background')?.classList.add(classes[index])
}
