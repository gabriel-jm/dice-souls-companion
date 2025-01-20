import './style.css'

import DiceBox from '@3d-dice/dice-box';

const diceBox = new DiceBox({
  assetPath: '/assets/',
  container: '#app',
  themeColor: '#3f3f3f'
})

let totalAmount = 0
let redDiceRolled = 0

moneyForm.addEventListener('submit', (event: Event) => {
  event.preventDefault()
  const moneyInput = moneyForm.elements.namedItem('money') as HTMLInputElement
  const moneyInCents = Number(moneyInput.value)
  const moneyValue = moneyInCents / 100

  console.log({ moneyValue })

  totalAmount = totalAmount + moneyInCents

  const blueOrBlackDice = moneyValue / 50
  const redDice = (totalAmount / 100) / 50

  console.log({ blueOrBlackDice, redDice, totalAmount })

  diceBox.clear()

  if (blueOrBlackDice > 0) {
    rollDice(blueOrBlackDice, 'black')
  }

  if ((redDice - redDiceRolled) > 0) {
    rollDice(redDice - redDiceRolled, 'red')
  }

  redDiceRolled += (redDice - redDiceRolled)

  totalAmountP.innerText = `Total Amount: R$ ${totalAmount / 100} | Red Dice Rolled: ${redDiceRolled}`
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
