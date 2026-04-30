import { Router } from 'express'
import { swaggerSpec } from './swagger.js'

const router = Router()

router.get('/spec.json', (_req, res) => {
  res.json(swaggerSpec)
})

router.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>My Simple Wallet API</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <script
          id="api-reference"
          data-url="/api/docs/spec.json"
          src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
  `)
})

export default router
