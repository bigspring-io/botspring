import type { Event } from '@botspring/types'
import type { SlackEvent } from '@slack/bolt'
import { Surface } from 'slack-block-builder'

export const buildSurface = <EventType extends SlackEvent['type']>(
  builder: (
    event: Event<EventType>
  ) => Surface.Surface | Promise<Surface.Surface>
) =>
  builder instanceof Promise
    ? async (event: Event<EventType>) =>
        (await builder(event)).buildToObject() as unknown
    : (event: Event<EventType>) =>
        (builder(event) as Surface.Surface).buildToObject() as unknown // Temp fix for type mismatch
