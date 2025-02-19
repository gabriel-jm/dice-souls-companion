import { ServerResponse } from 'node:http'
import { RollResultRepository } from './roll-result-repository'
import { Req } from '../local-server/start-server'

type RollResultsData = {
  activeEffects: DieEffect[]
  temporary: DieEffect[]
}

export async function setCurrent(req: Req<RollResultsData>, res: ServerResponse) {
  const { body } = req

  const rollStorage = new RollResultRepository()
  await rollStorage.setCurrent(body)

  res.statusCode = 200
  res.end()
}

export async function getCurrent(req: Req, res: ServerResponse) {
  const { searchParams } = req.url
  const rollStorage = new RollResultRepository()

  const current = await rollStorage.getCurrent()

  if (searchParams.get('type') === 'json') {
    res.statusCode = 200
    return res.end(JSON.stringify(current))
  }

  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
  res.end(/*html*/`
    <p>Efeitos Ativos:</p>
    <br/>
    <ul>
      ${
        current?.activeEffects
          .map(item => `<li>${item.text}</li>`)
          .join('\n')
        ?? ''
      }
    </ul>
    
    <br/>
    <br/>

    <p>Temporários:</p>
    <br/>
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
