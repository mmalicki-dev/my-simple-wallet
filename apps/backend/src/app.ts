import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import env from './config/env'
import './config/passport'
import routes from './api/routes'

const app = express()

app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'))

app.use('/api', routes)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
