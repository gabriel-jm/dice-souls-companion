import './style.css'

import DiceBox, { DiceGroupRollResult } from '@3d-dice/dice-box';

const diceBox = new DiceBox({
  assetPath: '/assets/',
  container: '#app',
  scale: 4.2,
})

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

let totalAmount = 0
let redDiceRolled = 0

moneyForm.addEventListener('submit', event => {
  event.preventDefault()
  const moneyInCents = Number(moneyInput.value.replace(',', ''))

  if (moneyInCents === 0) return

  const moneyValue = moneyInCents / 100

  totalAmount = totalAmount + moneyInCents

  const blueOrBlackDice = moneyValue / 50
  const redDice = (totalAmount / 100) / 50

  diceBox.clear()

  if (blueOrBlackDice >= 1) {
    rollDice(blueOrBlackDice, 'black')
      .then(result => parseRollResults('black', result))
  }

  if ((redDice - Math.floor(redDiceRolled)) >= 1) {
    rollDice((redDice - Math.floor(redDiceRolled)), 'red')
      .then(result => parseRollResults('red', result))
  }

  redDiceRolled += (redDice - redDiceRolled)

  totalAmountP.innerHTML = `
    <span class="total-amount-span">
      💸 Valor Total: R$ ${(totalAmount / 100).toFixed(2).replace('.', ',')}
    </span>
    <span class="total-amount-span">
      🎲 Dados Vermelhos Lançados: ${redDiceRolled}
    </span>
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
  const diceCount = Math.floor(count)
  const results = diceBox.add(
    `${diceCount}d20`,
    { themeColor: diceColors[type] }
  )

  return results
}

function parseRollResults(type: DieTypes, results: DiceGroupRollResult[]) {
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

await diceBox.init()
