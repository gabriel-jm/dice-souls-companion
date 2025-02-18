import { open } from 'sqlite'
import path from 'node:path'
import { getAppDataPath } from '../app-path/app-path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { Database } = require('sqlite3')

export async function connectDB() {
  try {
    const appDataPath = path.join(getAppDataPath(), 'dsc.db')

    const db = await open({
      filename: appDataPath,
      driver: Database
    })

    db.on('error', console.log)

    await db.migrate({
      migrationsPath: path.resolve('electron', 'database', 'migrations')
    })
  } catch(error) {
    console.log(error)
    throw error;
  }
}
