import './style.css'

import DiceBox from '@3d-dice/dice-box';
import { manualThrow } from './manual-throw/manual-throw'
import { signal } from 'lithen-fns'
import { addGreenBackgroundEvent } from './green-background/green-background-btn'
import { moneyFormEvents } from './donate-form/money-form-events'

export const diceBox = new DiceBox({
  assetPath: '/assets/',
  container: '#app',
  scale: 4,
})

export const isLocal = location.hostname === 'localhost'
export const isLocked = signal(false)

addGreenBackgroundEvent()
moneyFormEvents()
ui.append(manualThrow())

export type DieTypes = 'black' | 'blue' | 'red'

const diceColors: Record<DieTypes, string> = {
  black: '#242424',
  red: '#ad2510',
  blue: '#1a30a9'
}

export function rollDice(quantity: number, type: DieTypes) {
  const diceCount = Math.floor(quantity)

  if (diceCount <= 0) return

  const results = diceBox.add(
    `${diceCount}d20`,
    { themeColor: diceColors[type] }
  )

  return results
}

diceBox.init().catch(console.log)

document.getElementById('copy')?.addEventListener('click', () => {
  const text = `\
Efeitos Ativos:\
  ${redEffects.innerText.split('\n').map(line => '\n ' + line.substring(2)).join('')}
  
Temporários:\
  ${blackEffects.innerText.split('\n').map(line => '\n ' + line.substring(2)).join('')}
`

  console.log(text)
})
