import { IncomingMessage, ServerResponse } from 'node:http'
import { parseJSONBody } from './parse-json-body'
import { RollResultStorage } from '../roll-result/roll-result-storage'

type RollResultsData = {
  activeEffects: DieEffect[]
  temporary: DieEffect[]
}

export async function insertResults(req: IncomingMessage, res: ServerResponse) {
  const body = await parseJSONBody<RollResultsData>(req)

  const rollStorage = new RollResultStorage()
  await rollStorage.insert({
    activeEffects: body.activeEffects,
    temporary: body.temporary
  })

  res.statusCode = 201
  res.end()
}

export async function setCurrent(req: IncomingMessage, res: ServerResponse) {
  const body = await parseJSONBody<RollResultsData>(req)

  const rollStorage = new RollResultStorage()
  rollStorage.current = body

  res.statusCode = 200
  res.end()
}

export async function getCurrent(_req: IncomingMessage, res: ServerResponse) {
  // const queryParams = req
  const rollStorage = new RollResultStorage()

  res.statusCode = 200
  res.end(JSON.stringify(rollStorage))
}

export async function getLatestResults(_req: IncomingMessage, res: ServerResponse) {
  const rollStorage = new RollResultStorage()
  const result = await rollStorage.latest()

  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  res.end(/*html*/`
    <p>Efeitos Ativos:</p>
    <ul>
      ${
        result?.activeEffects
          .map(item => `<li>${item.text}</li>`)
          .join('\n')
        ?? ''
      }
    </ul>
      
    <p>Temporários:</p>
    <ul>
      ${
        result?.temporary
          .map(item => `<li>${item.text}</li>`)
          .join('\n')
        ?? ''
      }
    </ul>
  `)
}
