import { FastifyPluginAsync } from 'fastify'
import { nanoid } from 'nanoid'
import { QueryReqSchema, QueryRespSchema } from '../types.js'
import { logger } from '../utils/logger.js'
import { explainJson, getTableDdl } from '../db/tidb.js'

const queryPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.post('/query', async (req, reply) => {
    const body = QueryReqSchema.parse(req.body)
    const { query, userId } = body
    logger.info({ query, userId }, '收到查询')

    // 示例：对输入做简单复杂度评估并拉取 EXPLAIN JSON
    let plan: any = null
    try {
      plan = await explainJson(query)
    } catch (e) {
      logger.warn(e, 'EXPLAIN 失败，降级为模拟')
    }

    // 生成时间线ID与事件（此处硬编码，后续接入LLM+规则）
    const timelineId = nanoid(8)
    const events = [
      {
        id: 'e1',
        title: 'iPhone 发布',
        eventDate: '2007-01-09T00:00:00Z',
        description: '史蒂夫·乔布斯发布第一代 iPhone',
        sourceUrl: 'https://apple.com',
        confidence: plan ? 0.95 : 0.85, // 有 plan 则置信度更高
      },
      {
        id: 'e2',
        title: 'iPad 发布',
        eventDate: '2010-01-27T00:00:00Z',
        description: '苹果公司发布平板电脑 iPad',
        sourceUrl: 'https://apple.com',
        confidence: 0.92,
      },
    ]

    const resp = QueryRespSchema.parse({
      timelineId,
      events,
      confidence: 0.93,
    })

    return resp
  })
}

export const queryRoutes = queryPlugin