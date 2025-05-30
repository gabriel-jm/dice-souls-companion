declare const ui: HTMLDivElement
declare const redEffectsListEl: HTMLUListElement
declare const blackEffectsListEl: HTMLUListElement
declare const rollResult: HTMLDivElement
declare const rollResultActions: HTMLDivElement
declare const greenBackgroundBtn: HTMLButtonElement
declare const editDialog: HTMLDialogElement
declare const logsDiv: HTMLDivElement

// Audio / SFX
declare const addDiceSfx: HTMLAudioElement

declare type CreateRollResultProps = {
  activeEffects: DieEffect[]
  temporary: DieEffect[]
}

declare type DieEffect = {
  number: number
  text: string
}
