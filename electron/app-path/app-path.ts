import { app } from 'electron'
import path from 'node:path'
import { IS_DEV } from '../main'

export function getAppDataPath() {
  return IS_DEV
    ? path.resolve('tmp')
    : path.join(app.getPath('userData'), 'Local Storage')
}
