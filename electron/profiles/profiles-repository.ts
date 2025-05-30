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

export const profilesRepository = {
  getAll,
  getActive
}
