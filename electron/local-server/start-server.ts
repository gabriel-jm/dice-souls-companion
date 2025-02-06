import { createServer, IncomingHttpHeaders } from 'node:http'
import { cors } from './cors'
import { getCurrent, getLatestResults, insertResults, setCurrent } from './results-controller'
import { parseJSONBody } from './parse-json-body'

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

  if (url.pathname === '/results') {
    if (method === 'GET') {
      return await getLatestResults(customReq, res)
    }
    
    if (method === 'POST') {
      return await insertResults(customReq, res)
    }
  }

  if (url.pathname === '/current') {
    if (method === 'GET') {
      return await getCurrent(customReq, res)
    }

    if (method === 'POST') {
      return await setCurrent(customReq, res)
    }
  }

  res.statusCode = 404
  res.end('Not Found')
})

export function startServer() {
  server.listen(3500, () => console.log('Server on!'))
}
