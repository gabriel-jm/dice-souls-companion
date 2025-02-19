import { Database as DB, open } from 'sqlite'
import path from 'node:path'
import { getAppDataPath, getMigrationsPath } from '../app-path/app-path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { Database } = require('sqlite3')

let db: DB

export async function connectDB() {
  const appDataPath = path.join(getAppDataPath(), 'dsc.db')

  db = await open({
    filename: appDataPath,
    driver: Database
  })

  db.on('error', console.log)

  await db.migrate({ migrationsPath: getMigrationsPath() })
}

export async function sql<T = unknown>(
  strs: TemplateStringsArray,
  ...values: any[]
) {
  const sqlText = strs.join('?').trim()

  return await db.get<T>(sqlText, ...values)
}
