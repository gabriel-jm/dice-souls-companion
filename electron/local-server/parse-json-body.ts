import { IncomingMessage } from 'node:http'

export function parseJSONBody<T = unknown>(request: IncomingMessage): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      const requestData = []
  
      for await (const data of request) {
        requestData.push(data)
      }

      if (!requestData.length) return resolve(null as T)

      const body = Buffer.concat(requestData).toString()

      resolve(JSON.parse(body))
    } catch(error) {
      reject(error)
    }
  })
}
