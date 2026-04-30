import { readFileSync } from 'node:fs'
import { load } from 'js-yaml'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const swaggerSpec = load(
  readFileSync(join(__dirname, 'openapi.yaml'), 'utf-8')
)
