import type { ViewsPublishArguments } from '@slack/web-api'
import type { Listener } from '@botspring/types'
import { buildSurface } from '@botspring/utils/slack'
import { HomeTab, Blocks } from 'slack-block-builder'

const eventType = 'app_home_opened'

const buildHomeTab = buildSurface<typeof eventType>(event =>
  HomeTab()
    // .privateMetaData()
    .blocks([
      Blocks.Header().text('*Welcome home, <@' + event.user + '> :house:*'),
      Blocks.Section().text(
        'Learn how home tabs can be more useful and interactive <https://api.slack.com/surfaces/tabs/using|*in the documentation*>.'
      ),
    ])
)

// Listen for users opening the BotSpring Home tab
export const home: Listener = app =>
  app.event(eventType, async ({ event, client }) => {
    await client.views.publish(buildHomeTab(event) as ViewsPublishArguments)
  })
