import { z } from 'zod'

export const QueryReqSchema = z.object({
  query: z.string().min(1),
  userId: z.string().optional(),
})
export type QueryReq = z.infer<typeof QueryReqSchema>

export const QueryRespSchema = z.object({
  timelineId: z.string(),
  events: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      eventDate: z.string(), // ISO
      description: z.string().optional(),
      sourceUrl: z.string().optional(),
      confidence: z.number().min(0).max(1),
    })
  ),
  confidence: z.number().min(0).max(1),
})
export type QueryResp = z.infer<typeof QueryRespSchema>