import { el, html } from 'lithen-fns'
import { diceMaster, DieTypes } from '../dice-master'

export type SingleDieLogProps = {
  type: DieTypes
  value: number
  action: string
}

export function singleDieLog({ type, value, action }: SingleDieLogProps) {
  const val = String(value).padStart(2, '0')
  const effectList = type === 'red'
    ? diceMaster.redDieEffects
    : diceMaster.blackDieEffects

  logsDiv.append(html`
    <p>
      <span>${action}</span>
      <span class="${type}">
        [${val} - ${effectList[value - 1]}]
      </span>
    </p>
  `)
}

type DiceLogData = string | {
  type: DieTypes
  value: number
}

export function diceLog(...entries: DiceLogData[]) {
  logsDiv.append(html`
    <p>
      ${entries.map(entry => {
        if (typeof entry === 'string') {
          return el/*html*/`<span> ${entry} </span>`
        }

        const { type, value } = entry
        const val = String(value).padStart(2, '0')

        if (type === 'blue') {
          return el/*html*/`
            <span class="${type}">
              [${val}]
            </span>
          `
        }

        const effectList = type === 'red'
          ? diceMaster.redDieEffects
          : diceMaster.blackDieEffects
        const effect = effectList[value - 1]

        return el/*html*/`
          <span class="${type}">[${val} ${effect}]</span>
        `
      })}
    </p>  
  `)

  logsDiv.scrollTo({ behavior: 'smooth', top: logsDiv.scrollHeight })
}
