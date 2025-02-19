import { readFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { getAppDataPath } from '../app-path/app-path'
import { sql } from './connection'

export async function migrateCurrentResults() {
  const filePath = path.join(getAppDataPath(), 'current.json')
  const current = await readFile(filePath).catch(() => null)

  if (!current) return

  const currentData = current.toString('utf-8')

  await sql`
    update currentResult
    set value = ${currentData}, updatedAt = ${new Date()};
  `

  await unlink(filePath)
}
