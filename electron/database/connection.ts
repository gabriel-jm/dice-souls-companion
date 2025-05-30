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
  const templStrs = [...strs]

  const values = rawValues
    .map((v, index) => {
      if (v instanceof SQLUpdateCommand) {
        const { text, values } = v.parse()

        const previousText = templStrs[index]
        templStrs[index] = `${previousText} ${text}`

        return values
      }
      
      return parseTemplateValue(v)
    })
    .flat()

  const sqlText = templStrs.join('?').trim()

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

function parseTemplateValue(v: unknown) {
  if (v && (typeof v === 'object' || Array.isArray(v))) {
    if (v instanceof Date) {
      return v
    }
    
    return JSON.stringify(v)
  }

  return v
}

class SQLUpdateCommand {
  #value: Record<string, unknown>

  constructor(value: Record<string, unknown>) {
    this.#value = value
  }

  parse() {
    const texts: string[] = []
    const values: unknown[] = []
    const entries = Object.entries(this.#value)

    for (const i in entries) {
      const index = Number(i)
      const [key, value] = entries[index]
      const isLast = index + 1 === entries.length

      texts.push(`${key} = ${isLast ? '' : '?'}`)
      values.push(parseTemplateValue(value))
    }

    return {
      text: texts.join(','),
      values
    }
  }
}

sql.update = (record: Record<string, unknown>) => new SQLUpdateCommand(record)
