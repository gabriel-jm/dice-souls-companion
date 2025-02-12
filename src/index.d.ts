declare const app: HTMLDivElement
declare const ui: HTMLDivElement
declare const totalAmountP: HTMLParagraphElement
declare const moneyForm: HTMLFormElement
declare const moneyInput: HTMLInputElement
declare const redEffectsListEl: HTMLUListElement
declare const blackEffectsListEl: HTMLUListElement
declare const rollResult: HTMLDivElement
declare const rollResultActions: HTMLDivElement
declare const diceToRollDiv: HTMLDivElement
declare const greenBackgroundBtn: HTMLButtonElement
declare const editDialog: HTMLDialogElement
declare const logsDiv: HTMLDivElement

declare type CreateRollResultProps = {
  activeEffects: DieEffect[]
  temporary: DieEffect[]
}

declare type DieEffect = {
  number: number
  text: string
}
