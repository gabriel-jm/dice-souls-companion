import './style.css'

import DiceBox from '@3d-dice/dice-box';
import { diceToRollCard } from './roll-display/dice-to-roll'
import { manualThrow } from './manual-throw/manual-throw'
import { signal } from 'lithen-fns'

export const diceBox = new DiceBox({
  assetPath: '/assets/',
  container: '#app',
  scale: 4,
})

export const isLocked = signal(false)

ui.append(manualThrow())

moneyInput.addEventListener('input', () => {
  const value = moneyInput.value.replace(/\D/g, '')

  if (!value) {
    moneyInput.value = ''
    return
  }

  const moneyAmount = Number(value) / 100
  moneyInput.value = moneyAmount.toFixed(2).replace('.', ',')
})

export const stats = {
  totalAmount: 0,
  redDiceRolled: 0
}

moneyForm.addEventListener('submit', event => {
  event.preventDefault()

  if (isLocked.data()) return

  const donateOwner = moneyForm.donateOwner
  const moneyInCents = Number(moneyInput.value.replace(',', ''))

  if (moneyInCents === 0) return

  if (moneyInCents >= 200000) {
    moneyForm.reset()
    return
  }

  const moneyValue = moneyInCents / 100

  stats.totalAmount = stats.totalAmount + moneyInCents

  const blueOrBlackDiceToRoll = Math.min(Math.floor(moneyValue / 50), 2)
  const redDice = (stats.totalAmount / 100) / 50

  diceBox.clear()

  const redDiceToRoll = Math.floor(redDice - Math.floor(stats.redDiceRolled))

  if (blueOrBlackDiceToRoll > 0 || redDiceToRoll > 0) {
    diceToRollDiv.replaceChildren(
      diceToRollCard({
        amount: moneyInput.value,
        donateOwner: donateOwner.value,
        dice: {
          red: redDiceToRoll,
          blackOrBlue: blueOrBlackDiceToRoll
        },
        rollDice,
      })
    )
  }

  totalAmountP.innerHTML = `
    <span class="total-amount-span">
      💸 Valor Total: R$ ${(stats.totalAmount / 100).toFixed(2).replace('.', ',')}
    </span>
  `

  moneyForm.reset()
})

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
