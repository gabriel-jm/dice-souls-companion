import { createServer, IncomingHttpHeaders } from 'node:http'
import { cors } from './cors'
import { getCurrent, setCurrent } from '../roll-result/results-controller'
import { parseJSONBody } from './parse-json-body'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { IS_DEV } from '../main'
import { connectDB } from '../database/connection'
import { migrateCurrentResults } from '../database/migrate-current-results'

export type Req<T = null> = {
  url: URL
  headers: IncomingHttpHeaders
  body: T
}

const server = createServer(async (req, res) => {
  const url = new URL(`http://localhost${req.url}`)
  const { method } = req

  cors(res)

  if (method === 'OPTIONS') {
    res.statusCode = 200
    res.end()

    return
  }

  const customReq: Req<any> = {
    url,
    headers: req.headers,
    body: await parseJSONBody(req)
  }

  try {
    if (url.pathname === '/current') {
      if (method === 'GET') {
        return await getCurrent(customReq, res)
      }
  
      if (method === 'POST') {
        return await setCurrent(customReq, res)
      }
    }
  } catch(error) {
    console.log('error', error)

    res.statusCode = 500
    return res.end('Internal Error')
  }

  res.statusCode = 404
  res.end('Not Found')
})

export async function startServer() {
  if (IS_DEV && !existsSync(path.resolve('tmp'))) {
    await mkdir(path.resolve('tmp'))
  }

  await connectDB()
  await migrateCurrentResults()

  server.listen(3500, () => console.log('Server on!'))
}
