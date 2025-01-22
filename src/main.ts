import './style.css'

import DiceBox from '@3d-dice/dice-box';

const diceBox = new DiceBox({
  assetPath: '/assets/',
  container: '#app',
  themeColor: '#3f3f3f'
})

moneyInput.addEventListener('input', () => {
  const value = moneyInput.value.replace(/\D/g, '')

  if (!value) {
    moneyInput.value = ''
    return
  }

  const moneyAmount = Number(value) / 100
  moneyInput.value = moneyAmount.toFixed(2).replace('.', ',')
})

let totalAmount = 0
let redDiceRolled = 0

moneyForm.addEventListener('submit', event => {
  event.preventDefault()
  const moneyInCents = Number(moneyInput.value.replace(',', ''))

  if (moneyInCents === 0) return

  const moneyValue = moneyInCents / 100

  console.log({ moneyValue })

  totalAmount = totalAmount + moneyInCents

  const blueOrBlackDice = moneyValue / 50
  const redDice = (totalAmount / 100) / 50

  console.log({ blueOrBlackDice, redDice, totalAmount })

  diceBox.clear()

  if (blueOrBlackDice >= 1) {
    rollDice(blueOrBlackDice, 'black')
  }

  if ((redDice - parseInt(redDiceRolled.toString())) >= 1) {
    rollDice((redDice - parseInt(redDiceRolled.toString())), 'red')
  }

  redDiceRolled += (redDice - redDiceRolled)

  totalAmountP.innerHTML = `
    <span class="total-amount-span">🎲 Red Dice Rolled: ${redDiceRolled}</span>
    <span class="total-amount-span">💸 Total Amount: R$ ${(totalAmount / 100).toFixed(2).replace('.', ',')}</span>
  `

  moneyForm.reset()
})

type DieTypes = 'black' | 'blue' | 'red'

const diceColors: Record<DieTypes, string> = {
  black: '#242424',
  red: '#ad2510',
  blue: '#1a30a9'
}

function rollDice(count: number, type: DieTypes) {
  const diceCount = parseInt(String(count))
  diceBox.add(`${diceCount}d20`, { themeColor: diceColors[type] })
}

await diceBox.init()
