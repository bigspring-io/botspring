import type { AWS } from '@serverless/typescript'
import type { Method } from '@botspring/types/Method'
import { routes } from '@botspring/config/routes'
import { requiredVariables } from '@botspring/config/requiredVariables'

// Map environment variables to ${env:VARIABLE_NAME}
const envVariables = requiredVariables.reduce((envVars, variable) => {
  return { ...envVars, [variable]: `\${env:${variable}}` }
}, {} as { [variable: string]: string })

// Map custom webhook routes to function events
type Events = { http: { method: Uppercase<string>; path: string } }[]
const webhookEvents = Object.keys(routes).reduce((events, path) => {
  const route = routes[path]
  const methods = Object.keys(route) as Method[]
  return [
    ...events,
    ...methods.map(method => ({
      http: { method: method.toUpperCase(), path: `/webhook${path}` },
    })),
  ]
}, [] as Events)

// Config
const serverlessConfiguration: AWS = {
  service: 'botspring',
  frameworkVersion: '2',
  useDotenv: true,
  package: {
    individually: true,
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'development',
    region: 'ap-south-1',
    // TODO: Connect to redis on AWS
    // vpc: {
    //     securityGroupIds: [],
    //     subnetIds: []
    // },
    apiGateway: {
      minimumCompressionSize: 1024, // Enable gzip compression for responses > 1 KB
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      ...envVariables,
    },
    lambdaHashingVersion: '20201221',
  },
  custom: {
    webpack: {
      webpackConfig: 'webpack.config.js',
      includeModules: true,
      packager: 'yarn',
      excludeFiles: 'src/**/*.(test|spec).js',
    },
    prune: { automatic: true, number: 5 },
    'serverless-offline': {
      host: '0.0.0.0',
      httpPort: 5050,
      websocketPort: 5051,
      lambdaPort: 5052,
      useWorkerThreads: true,
      printOutput: true,
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-prune-plugin',
  ],
  functions: {
    slack: {
      handler: 'src/handler.handler',
      timeout: 30,
      events: [
        { http: { method: 'POST', path: '/slack/events' } },
        ...webhookEvents,
      ],
    },
  },
}

module.exports = serverlessConfiguration
