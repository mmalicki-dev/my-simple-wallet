import { readFileSync } from 'node:fs'
import { load } from 'js-yaml'
import { join } from 'node:path'

export const swaggerSpec = load(
  readFileSync(join(__dirname, 'openapi.yaml'), 'utf-8')
)
