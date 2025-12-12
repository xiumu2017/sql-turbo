import { FastifyPluginAsync } from 'fastify'

const timelinePlugin: FastifyPluginAsync = async (fastify) => {
  // 预留：获取时间线详情、验证、评分等路由
  fastify.get('/timeline/:id', async (req, reply) => {
    return { id: req.params.id, message: 'TODO' }
  })
}

export const timelineRoutes = timelinePlugin