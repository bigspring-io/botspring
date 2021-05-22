import { Listener, ActionId } from '@botspring/types'

export const buttonClick: Listener = app =>
  app.action(ActionId.BUTTON_CLICK, async ({ body, ack, say }) => {
    // Acknowledge the action
    await ack()
    await say(`<@${body.user.id}> clicked the button`)
  })
