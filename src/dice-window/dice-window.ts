import './dice-window.css'
import { diceRoller } from '../dice-master/roller/dice-roller'

diceRoller.init()

window.ipcRenderer.on('roll-dice', (_, type, quantity) => {
  diceRoller.rollDice(type, quantity)
})

document.querySelector('#t')?.addEventListener('click', () => {
  diceRoller.clear()
  diceRoller.rollDice('red', 3)
})
