import { randomUUID } from 'node:crypto'
import { sql } from '../database/connection'

type Profile = {
  id: string
  name: string
  redEffects: string[]
  blackEffects: string[]
  blueEffects: string[]
}

function getAll() {
  return sql<Profile>`Select * From profiles;`
}

async function getActive() {
  const [profile] = await sql<Profile>`
    Select profiles.* From profiles
    Join userConfig on userConfig.profileId = profiles.id;
  `

  return profile
}

function add(data: Omit<Profile, 'id'>) {
  const id = randomUUID()
  
  return sql`
    Insert Into profiles
    Values (
      ${id},
      ${data.name},
      ${data.redEffects},
      ${data.blackEffects},
      ${data.blueEffects}
    );
  `
}

function setActive(id: string) {
  return sql`
    Update userConfig Set profileId = ${id};
  `
}

function update(data: Partial<Profile>) {
  return sql`
    Update profiles
    Set ${sql.update(data)}
    Where id = ${data.id};
  `
}

export const profilesRepository = {
  getAll,
  getActive,
  add,
  setActive,
  update
}
