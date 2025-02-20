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
  ...rawValues: any[]
) {
  const sqlText = strs.join('?').trim()
  const values = rawValues.map(v => {
    if (v && (typeof v === 'object' || Array.isArray(v))) {
      if (v instanceof Date) {
        return v
      }
      
      return JSON.stringify(v)
    }

    return v
  })

  const data = await db.all<T[]>(sqlText, ...values)

  for (const row of data as Record<string, unknown>[]) {
    for (const key in row) {
      const value = row[key]

      if (typeof value === 'string') {
        if (value.startsWith('{') || value.startsWith('[')) {
          row[key] = JSON.parse(value)
        }
      }
    }
  }
  
  return data
}
