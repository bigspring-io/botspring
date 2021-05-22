import type { App } from '@slack/bolt'

export type Listener = (app: App) => void
