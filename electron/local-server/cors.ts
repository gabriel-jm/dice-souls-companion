import { ServerResponse } from 'node:http'

export function cors(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  res.setHeader('Access-Control-Max-Age', '86400')
}
