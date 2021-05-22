import type { SlackEvent, SlackEventMiddlewareArgs } from '@slack/bolt'

export type Event<EventType extends SlackEvent['type']> =
  SlackEventMiddlewareArgs<EventType>['payload']
