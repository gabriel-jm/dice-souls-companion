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
  const command = data.command ? `'${data.command}'` : null

  await sql`
    Insert Into shortcut
    Values ('${id}', '${data.name}', ${command})
    On Conflict (name) Do Update Set command = ${command};
  `
}

export const shorcutsRepository = {
  getAll: getAllShortcuts,
  add: addShortcut
}
