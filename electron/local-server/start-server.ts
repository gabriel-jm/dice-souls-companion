import { createServer } from 'node:http'
import { cors } from './cors'
import { getLatestResults, insertResults, setCurrent } from './results-controller'

const server = createServer(async (req, res) => {
  const url = new URL(`http://localhost${req.url}`)
  const { method } = req

  cors(res)

  if (method === 'OPTIONS') {
    res.statusCode = 200
    res.end()

    return
  }

  if (url.pathname === '/results') {
    if (method === 'GET') {
      return await getLatestResults(req, res)
    }
    
    if (method === 'POST') {
      return await insertResults(req, res)
    }
  }

  if (url.pathname === '/current') {
    if (method === 'POST') {
      return await setCurrent(req, res)
    }
  }

  res.statusCode = 404
  res.end('Not Found')
})

export function startServer() {
  server.listen(3500, () => console.log('Server on!'))
}
