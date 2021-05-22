import type { Handler } from 'aws-lambda'

export const runWarm =
  (handler: Handler): Handler =>
  (event, context, callback) => {
    // Detect the keep-alive ping from CloudWatch and exit early.
    // This keeps our lambda function running hot.
    if (!process.env.IS_LOCAL && event.source === 'aws.events') {
      return callback(null, 'pinged')
    }
    return handler(event, context, callback)
  }
