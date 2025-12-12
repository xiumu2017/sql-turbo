import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import { config } from './config.js'
import { queryRoutes } from './routes/query.js'
import { timelineRoutes } from './routes/timeline.js'
import { logger } from './utils/logger.js'

const fastify = Fastify({ logger })

await fastify.register(helmet)
await fastify.register(cors, { origin: true })

fastify.register(queryRoutes, { prefix: '/api' })
fastify.register(timelineRoutes, { prefix: '/api' })

fastify.get('/health', async () => ({ status: 'ok' }))

const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()