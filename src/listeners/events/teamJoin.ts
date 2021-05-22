import type { ChatPostMessageArguments } from '@slack/web-api'
import type { Listener } from '@botspring/types'
import { buildSurface } from '@botspring/utils/slack'
import { getRandomGif } from '@botspring/utils'
import { Message, Blocks } from 'slack-block-builder'

const eventType = 'team_join'
const channel = 'CKHM4TNQ5' // #team-global

const buildMessage = buildSurface<typeof eventType>(async event => {
  // Get welcome GIF
  const {
    title: gifTitle = 'Welcome!',
    url: gifUrl = 'https://media.giphy.com/media/xUPGGDNsLvqsBOhuU0/source.gif',
  } = await getRandomGif('welcome')
  // Build payload
  const headerText = `🎉 Welcome to BigSpring, <@${event.user}>!`
  const bodyText = 'Please introduce yourself to the team!'
  return Message()
    .channel(channel)
    .text(headerText)
    .blocks([
      Blocks.Header().text(headerText),
      Blocks.Section().text(bodyText),
      Blocks.Image().imageUrl(gifUrl).altText(gifTitle),
    ])
})

// When a user joins the team, send a welcome message in #team-global
export const teamJoin: Listener = app =>
  app.event(eventType, async ({ event, client }) => {
    // Build message
    const message = (await buildMessage(event)) as ChatPostMessageArguments
    // Send message
    const { ts } = await client.chat.postMessage(message)
    // Pin message
    if (ts) {
      await client.pins.add({ channel, timestamp: ts })
    }
  })
