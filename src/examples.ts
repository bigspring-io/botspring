/* eslint-disable */

import './utils/env'
import { App, LogLevel, subtype } from '@slack/bolt'
import type { BotMessageEvent, BlockAction } from '@slack/bolt'
import type { ChatPostMessageArguments } from '@slack/web-api'
import { Message, Blocks, Elements } from 'slack-block-builder'
import {
  isGenericMessageEvent,
  isMessageItem,
} from '@botspring/utils/slack/helpers'

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  logLevel: LogLevel.DEBUG,
})

/**
 * Listening to messages
 */
// This will match any message that contains 👋
app.message(':wave:', async ({ message, say }) => {
  if (!isGenericMessageEvent(message)) return

  await say(`Hello, <@${message.user}>`)
})

/**
 * Sending messages
 */
// Listens for messages containing "knock knock" and responds with an italicized "who's there?"
app.message('knock knock', async ({ say }) => {
  await say(`_Who's there?_`)
})

// Sends a section block with datepicker when someone reacts with a 📅 emoji
app.event('reaction_added', async ({ event, client }) => {
  // Could be a file that was reacted upon
  if (event.reaction === 'calendar' && isMessageItem(event.item)) {
    const message = Message()
      .channel(event.item.channel)
      .text('Pick a reminder date')
      .blocks([
        Blocks.Section()
          .text('Pick a date for me to remind you')
          .accessory(
            Elements.DatePicker()
              .actionId('datepicker_remind')
              .initialDate(new Date())
              .placeholder('Select a date')
          ),
      ])
      .buildToObject() as unknown
    await client.chat.postMessage(message as ChatPostMessageArguments)
  }
})

/**
 * Listening to events
 */

app.message(subtype('bot_message'), async ({ message }) => {
  console.info(
    `The bot user ${(message as BotMessageEvent).user} said ${
      (message as BotMessageEvent).text
    }`
  )
})

/**
 * Using the Web API
 */
// Unix Epoch time for September 30, 2019 11:59:59 PM
const whenSeptemberEnds = '1569887999'

app.message('wake me up', async ({ message, client }) => {
  try {
    // Call chat.scheduleMessage with the built-in client
    await client.chat.scheduleMessage({
      channel: message.channel,
      post_at: whenSeptemberEnds,
      text: 'Summer has come and passed',
    })
  } catch (error) {
    console.error(error)
  }
})

/**
 * Listening to actions
 */
// Your listener function will be called every time an interactive component with the action_id "approve_button" is triggered
app.action('approve_button', async ({ ack }) => {
  await ack()
  // Update the message to reflect the action
})

// Your listener function will only be called when the action_id matches 'select_user' AND the block_id matches 'assign_ticket'
app.action(
  { action_id: 'select_user', block_id: 'assign_ticket' },
  async ({ body, client, ack }) => {
    await ack()
    // TODO
    body = body as BlockAction
    try {
      // Make sure the event is not in a view
      if (body.message) {
        await client.reactions.add({
          name: 'white_check_mark',
          timestamp: body.message?.ts,
          channel: body.channel?.id,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
)

// Your middleware will be called every time an interactive component with the action_id “approve_button” is triggered
app.action('approve_button', async ({ ack, say }) => {
  // Acknowledge action request
  await ack()
  await say('Request approved 👍')
})
;(async () => {
  // Start your app
  await app.start(Number(process.env.PORT) || 3000)

  console.info('⚡️ Bolt app is running!')
})()
