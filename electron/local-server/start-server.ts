import { createServer } from 'node:http'
import { RollResultStorage } from '../roll-result/roll-result-storage'

const server = createServer(async (req, res) => {
  const url = new URL(`http://localhost${req.url}`)

  if (url.pathname === '/results') {
    const rollStorage = new RollResultStorage()

    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify(await rollStorage.latest()))
    return
  }

  res.writeHead(404, {
    'access-control-allow-origin': '*'
  })
  res.end('Not Found.')
})

export function startServer() {
  server.listen(3500, () => console.log('Server on!'))
}
