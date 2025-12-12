import { useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'

interface Event {
  id: string
  title: string
  eventDate: string
  description?: string
  sourceUrl?: string
  confidence: number
}

export default function TimelinePage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<Event[]>([])
  const [timelineId, setTimelineId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const { data } = await axios.post('/api/query', { query })
      setTimelineId(data.timelineId)
      setEvents(data.events)
    } catch (err) {
      console.error(err)
      alert('查询失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">SQLFlash 时间线</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-3 border rounded resize-none"
          rows={3}
          placeholder="输入自然语言查询，例如：苹果公司历年重要产品发布"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '分析中…' : '查询'}
        </button>
      </form>

      {events.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">结果时间线</h2>
          <div className="space-y-4">
            {events.map((ev) => (
              <div key={ev.id} className="border rounded p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{ev.title}</div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(ev.eventDate), 'yyyy-MM-dd')}
                  </span>
                </div>
                {ev.description && <p className="text-gray-700 mt-1">{ev.description}</p>}
                {ev.sourceUrl && (
                  <a
                    href={ev.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 text-sm underline"
                  >
                    来源
                  </a>
                )}
                <div className="mt-2 text-xs text-gray-500">置信度 {Math.round(ev.confidence * 100)}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}