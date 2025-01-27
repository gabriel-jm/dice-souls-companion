import './style.css'

import DiceBox, { DiceGroupRollResult } from '@3d-dice/dice-box';
import { diceToRollCard } from './roll-display/dice-to-roll'

const redDieEffects = [
  'Armas Nv.1',
  'Só Escudo',
  'Proibido Curar',
  'Sem Elixir Magnífico',
  'Sem Summon',
  'Sem Cinza da Guerra',
  'Region Lock',
  'Run Genocida',
  'Sem Armadura',
  'Não upar STR/DEX',
  'Não upar INT/FTH/ARC',
  'Não upar HP',
  'Sem Mesa Redonda',
  'Use O Que Ver',
  'Sem Torrent',
  'Sem Mapa',
  '100% Drop Rate',
  '5x Runas',
  'Adiciona 50k de Souls',
  'Inimigos Paralisados',
]
const blackDieEffects = [
  'No Hit',
  'Sem Esquiva',
  'Tela Invertida',
  'Sem Arma',
  '1.5x Velocidade',
  '1/2 DMG -> 2x DEF',
  '2x DMG -> 1/2 DEF',
  '1/2 HP -> 2X VIG',
  '2x HP -> 1/2 VIG',
  'Rerroll All Dice!',
  'No Rush',
  'Sem Talismã',
  'Sem Travar Mira',
  'Fat Roll',
  'Teclado e Mouse',
  'Só Ataque Carregado',
  'Sem Graça Nova',
  'Proibido Upar',
  'Só Ataque com Pulo',
  'One Hit Kill',
]

moneyInput.addEventListener('input', () => {
  const value = moneyInput.value.replace(/\D/g, '')

  if (!value) {
    moneyInput.value = ''
    return
  }

  const moneyAmount = Number(value) / 100
  moneyInput.value = moneyAmount.toFixed(2).replace('.', ',')
})

const diceBox = new DiceBox({
  assetPath: '/assets/',
  container: '#app',
  scale: 4.2,
})

let totalAmount = 0
let redDiceRolled = 0

moneyForm.addEventListener('submit', event => {
  event.preventDefault()
  const donateOwner = moneyForm.donateOwner
  const moneyInCents = Number(moneyInput.value.replace(',', ''))

  if (moneyInCents === 0) return

  if (moneyInCents >= 200000) {
    moneyForm.reset()
    return
  }

  const moneyValue = moneyInCents / 100

  totalAmount = totalAmount + moneyInCents

  const blueOrBlackDiceToRoll = Math.floor(moneyValue / 50)
  const redDice = (totalAmount / 100) / 50

  diceBox.clear()

  const redDiceToRoll = Math.floor(redDice - Math.floor(redDiceRolled))

  // if (blueOrBlackDice >= 1) {
  //   rollDice(blueOrBlackDice, 'black')
  //     .then(result => parseRollResults('black', result))
  // }

  // if (redDiceToRoll >= 1) {
  //   rollDice(redDiceToRoll, 'red')
  //     .then(result => parseRollResults('red', result))
  // }

  // redDiceRolled += (redDice - redDiceRolled)

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
      💸 Valor Total: R$ ${(totalAmount / 100).toFixed(2).replace('.', ',')}
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

function rollDice(quantity: number, type: DieTypes) {
  const diceCount = Math.floor(quantity)
  const results = diceBox.add(
    `${diceCount}d20`,
    { themeColor: diceColors[type] }
  )

  return results
}

export function parseRollResults(type: DieTypes, results: DiceGroupRollResult[]) {
  console.log(type, results)
  let listElement = redEffects
  let effectsList = redDieEffects

  if (type !== 'red') {
    listElement = blackEffects
    effectsList = blackDieEffects
  }

  const newResults = results.map(result => {
    const effect = effectsList[result.value - 1]
    const li = document.createElement('li')
    li.innerText = effect
    return li
  })

  listElement.replaceChildren(...newResults)
}

diceBox.init().catch(console.log)
