import './dice-window.css'
import { DiceRoller } from '../dice-master/roller/dice-roller'

const diceRoller = new DiceRoller()
diceRoller.init()

window.ipcRenderer.on('roll-dice', (_, type, quantity) => {
  diceRoller.clear()
  diceRoller.rollDice(type, quantity)
})
