import { request } from './client'
import type { ApiMeta, Conversation, ConversationMessage } from './types'

export const conversations = {
  start(message) {
    return request<Conversation & { conversation?: Conversation }>('/api/v1/conversations', { method: 'POST', body: { message } })
  },
  list({ page = 1, limit = 20 } = {}) {
    return request<{ conversations: Conversation[]; meta: ApiMeta }>(`/api/v1/conversations?page=${page}&limit=${limit}`)
  },
  messages(id, { page = 1, limit = 50 } = {}) {
    return request<{ messages: ConversationMessage[]; meta: ApiMeta }>(`/api/v1/conversations/${id}/messages?page=${page}&limit=${limit}`)
  },
  send(id, content) {
    return request<ConversationMessage>(`/api/v1/conversations/${id}/messages`, {
      method: 'POST',
      body: { content },
    })
  },
}

export function pollMessages(conversationId, onNewMessages, intervalMs = 10000) {
  let lastCount = 0
  let timer = null
  let stopped = false

  const poll = async () => {
    if (stopped) return
    try {
      const data = await conversations.messages(conversationId, { limit: 50 })
      const msgs = data.messages || []
      if (msgs.length > lastCount) {
        lastCount = msgs.length
        onNewMessages(msgs)
      }
    } catch {
      // Polling is best-effort until realtime messaging is available.
    }
    if (!stopped) timer = setTimeout(poll, intervalMs)
  }

  poll()

  return function stop() {
    stopped = true
    if (timer) clearTimeout(timer)
  }
}
