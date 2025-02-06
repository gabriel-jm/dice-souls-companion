import { ServerResponse } from 'node:http'
import { RollResultStorage } from '../roll-result/roll-result-storage'
import { Req } from './start-server'

type RollResultsData = {
  activeEffects: DieEffect[]
  temporary: DieEffect[]
}

export async function insertResults(req: Req<RollResultsData>, res: ServerResponse) {
  const { body } = req

  const rollStorage = new RollResultStorage()
  await rollStorage.insert({
    activeEffects: body.activeEffects,
    temporary: body.temporary
  })

  res.statusCode = 201
  res.end()
}

export async function setCurrent(req: Req<RollResultsData>, res: ServerResponse) {
  const { body } = req

  const rollStorage = new RollResultStorage()
  rollStorage.current = body

  res.statusCode = 200
  res.end()
}

export async function getCurrent(req: Req, res: ServerResponse) {
  const { searchParams } = req.url
  const rollStorage = new RollResultStorage()

  if (searchParams.get('type') === 'json') {
    res.statusCode = 200
    return res.end(JSON.stringify(rollStorage))
  }

  const current = rollStorage.current
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  res.end(/*html*/`
    <p>Efeitos Ativos:</p>
    <ul>
      ${
        current?.activeEffects
          .map(item => `<li>${item.text}</li>`)
          .join('\n')
        ?? ''
      }
    </ul>
      
    <p>Temporários:</p>
    <ul>
      ${
        current?.temporary
          .map(item => `<li>${item.text}</li>`)
          .join('\n')
        ?? ''
      }
    </ul>
  `)
}

export async function getLatestResults(_req: Req, res: ServerResponse) {
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
