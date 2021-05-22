import 'source-map-support/register'
import fetch from 'node-fetch'
import morgan from 'morgan'
import serverlessExpress from '@vendia/serverless-express'
import { App, ExpressReceiver, LogLevel } from '@slack/bolt'
import { runWarm } from './utils/runWarm'
import { ConvoStore } from './utils/slack/convoStore'
import { webhooks } from './webhooks' // Custom webhook router
import * as listeners from './listeners' // Slack listeners

// Catch unhandled Promise rejections
process.on('unhandledRejection', error => {
  console.error('unhandledRejection:', error)
})

// Attach node-fetch for modules that expect it
global.fetch = fetch

// Set log level for Express & Slack
const logLevel = LogLevel[__DEV__ ? 'DEBUG' : 'WARN']

/*
 * Express
 */

// Initialize Express receiver
export const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  logLevel,
  processBeforeResponse: true, // Required for all FaaS environments (Lambda)
})

// Apply Express middleware
receiver.router
  // Log HTTP requests
  .use(morgan('tiny'))
  // Remove `x-powered-by: Express` header
  .use((_, res, next) => {
    res.removeHeader('x-powered-by')
    next()
  })
  // Attach Slack client to Express requests
  .use((req, _, next) => {
    ;(req as any).slack = app.client
    next()
  })
  // Attach custom webhook router
  .use('/webhook', webhooks)

/*
 * Slack
 */

// Initialize Slack app
export const app = new App({
  token: process.env.SLACK_BOT_TOKEN!,
  convoStore: new ConvoStore(), // Initialize Redis client
  receiver,
  logLevel,
})

// Attach Slack listeners
Object.keys(listeners).forEach(event =>
  listeners[event as keyof typeof listeners](app)
)

// Export Lambda handler
export const handler = runWarm(
  serverlessExpress({
    app: receiver.app,
  })
)
