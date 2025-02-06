import { diceBox, isLocked, rollDice } from '../main'
import { diceToRollCard } from '../roll-display/dice-to-roll'

export const stats = {
  totalAmount: 0,
  redDiceRolled: 0
}

export function moneyFormEvents() {
  moneyInput.addEventListener('input', () => {
    const value = moneyInput.value.replace(/\D/g, '')
  
    if (!value) {
      moneyInput.value = ''
      return
    }
  
    const moneyAmount = Number(value) / 100
    moneyInput.value = moneyAmount.toFixed(2).replace('.', ',')
  })
  
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
          rollDice: rollDice,
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
}
