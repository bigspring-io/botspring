import type { ConversationStore } from '@slack/bolt'
import type { ClientOpts } from 'redis'
import type { WrappedNodeRedisClient } from 'handy-redis'
import { createNodeRedisClient } from 'handy-redis'

export class ConvoStore<ConversationState = any> implements ConversationStore {
  private client: WrappedNodeRedisClient

  constructor(options: ClientOpts = {}) {
    this.client = createNodeRedisClient({ host: 'redis', ...options })
    this.client.nodeRedis.on('error', err => console.error(err))
  }

  private static getConvoKey(conversationId: string) {
    return `conversations/${conversationId}`
  }

  async set(
    conversationId: string,
    value: ConversationState,
    expiresAt?: number
  ): ReturnType<WrappedNodeRedisClient['set']> {
    const convoKey = ConvoStore.getConvoKey(conversationId)
    const payload = JSON.stringify({ value, expiresAt })
    return this.client.set(convoKey, payload)
  }

  async get(conversationId: string): Promise<ConversationState> {
    const convoKey = ConvoStore.getConvoKey(conversationId)
    const payload = await this.client.get(convoKey)
    if (!payload) {
      throw new Error('Conversation not found')
    }
    const { value, expiresAt } = JSON.parse(payload)
    if (!!expiresAt && Date.now() > expiresAt) {
      await this.client.del(convoKey)
      throw new Error('Conversation expired')
    }
    return value
  }
}
