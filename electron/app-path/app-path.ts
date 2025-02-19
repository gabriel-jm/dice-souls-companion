import { app } from 'electron'
import path from 'node:path'
import { IS_DEV } from '../main'

export function getAppDataPath() {
  return IS_DEV
    ? path.resolve('tmp')
    : app.getPath('userData')
}

export function getMigrationsPath() {
  return IS_DEV
    ? path.resolve('migrations')
    : path.join(import.meta.dirname, 'migrations')
}
