import './dice-window.css'
import { DiceRoller } from '../dice-master/roller/dice-roller'

const diceRoller = new DiceRoller()
diceRoller.init()

window.ipcRenderer.on('roll-dice', async (_, type, quantity) => {
  diceRoller.clear()
  const results = await diceRoller.rollDice(type, quantity)
  window.ipcRenderer.send('roll-dice-result', results)
})

window.ipcRenderer.on('roll-many', async (_, quantityRecord) => {
  diceRoller.clear()
  const results = await diceRoller.rollMany(quantityRecord)
  window.ipcRenderer.send('roll-many-result', results)
})
