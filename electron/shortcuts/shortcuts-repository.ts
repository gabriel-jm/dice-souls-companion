import { sql } from '../database/connection'

export type Shortcuts = {
  addRedDie: string | null
  removeRedDie: string | null
  addBlackDie: string | null
  removeBlackDie: string | null
  addBlueDie: string | null
  removeBlueDie: string | null
  throwDice: string | null
}

type AddShortcut = Partial<Shortcuts>

export async function getShortcut() {
  const [shorcuts] = await sql`Select shortcuts From userConfig;`

  return shorcuts
}

export async function addShortcut(shortcut: AddShortcut) {
  const data = {
    addRedDie: shortcut.addRedDie || null,
    removeRedDie: shortcut.removeRedDie || null,
    addBlackDie: shortcut.addBlackDie || null,
    removeBlackDie: shortcut.removeBlackDie || null,
    addBlueDie: shortcut.addBlueDie || null,
    removeBlueDie: shortcut.removeBlueDie || null,
    throwDice: shortcut.throwDice || null
  }
  
  await sql`
    Insert Into userConfig (shortcuts)
    Values (${data});
  `
}
