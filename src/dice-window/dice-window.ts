import './dice-window.css'
import { diceRoller } from '../dice-master/roller/dice-roller'

diceRoller.init()

window.ipcRenderer.on('roll-dice', (_, type, quantity) => {
  diceRoller.clear()
  diceRoller.rollDice(type, quantity)
})
