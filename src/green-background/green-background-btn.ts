import './green-background-btn.css'

export function addGreenBackgroundEvent() {
  const diceBoxContainer = document.querySelector('#dice-roller')!

  greenBackgroundBtn.addEventListener('click', () => {
    diceBoxContainer.classList.toggle('green-bg')
    const isActive = greenBackgroundBtn.classList.toggle('active')

    if (isActive) {
      greenBackgroundBtn.innerText = 'Fundo Verde'
    } else {
      greenBackgroundBtn.innerText = 'Fundo Transparente'
    }
  })
}
