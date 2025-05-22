import { sql } from '../database/connection'
import { randomUUID } from 'node:crypto'

export type Shortcut = {
  id: string
  name: string
  command: string | null
}

async function getAllShortcuts() {
  const shortcuts = await sql<Shortcut>`Select * From shortcuts;`

  return shortcuts;
}

async function getShortcutByCommand(command: string) {
  const [shortcut] = await sql<Shortcut>`
    Select * from shortcuts
    Where command = ${command};
  `

  return shortcut
}

async function addShortcut(data: Omit<Shortcut, 'id'>) {
  const id = randomUUID()

  await sql`
    Insert Into shortcuts (id, name, command)
    Values (${id}, ${data.name}, ${data.command})
    On Conflict (name) Do Update Set command = ${data.command};
  `
}

function removeShortcut(name: string) {
  return sql`
    Delete From shortcuts
    Where name = ${name};
  `
}

export const shorcutsRepository = {
  getAll: getAllShortcuts,
  getByCommand: getShortcutByCommand,
  add: addShortcut,
  remove: removeShortcut
}
