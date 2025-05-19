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
    Delete From shorcuts
    Where name = ${name};
  `
}

export const shorcutsRepository = {
  getAll: getAllShortcuts,
  add: addShortcut,
  remove: removeShortcut
}
