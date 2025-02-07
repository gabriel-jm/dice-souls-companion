export function addCopyResultsBtnEvent() {
  document.getElementById('copy')?.addEventListener('click', () => {
    const text = `\
Efeitos Ativos:\
  ${redEffectsListEl.innerText.split('\n').map(line => '\n ' + line.substring(2)).join('')}
  
Temporários:\
  ${blackEffectsListEl.innerText.split('\n').map(line => '\n ' + line.substring(2)).join('')}
`
  
    console.log(text)
  })
}
