import { Listener, ActionId } from '@botspring/types'
import { isGenericMessageEvent } from '@botspring/utils/slack'
import { Message, Blocks, Elements } from 'slack-block-builder'

export const hello: Listener = app =>
  app.message('hello', async ({ message, say }) => {
    // Filter out message events with subtypes (see https://api.slack.com/events/message)
    // Is there a way to do this in listener middleware with current type system?
    if (!isGenericMessageEvent(message)) return
    // say() sends a message to the channel where the event was triggered
    await say(
      Message()
        .blocks([
          Blocks.Section()
            .text(`Hey there <@${message.user}>!`)
            .accessory(
              Elements.Button().text('Click Me').actionId(ActionId.BUTTON_CLICK)
            ),
        ])
        .buildToJSON()
    )
  })
