export function addCopyResultsBtnEvent() {
  document.getElementById('copy')?.addEventListener('click', () => {
    const text = `\
Efeitos Ativos:\
  ${redEffects.innerText.split('\n').map(line => '\n ' + line.substring(2)).join('')}
  
Temporários:\
  ${blackEffects.innerText.split('\n').map(line => '\n ' + line.substring(2)).join('')}
`
  
    console.log(text)
  })
}
