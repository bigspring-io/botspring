import { Router } from 'express'
import jwt from 'express-jwt'
import { jwtConfig } from '@botspring/config/jwt'
import { Method } from '@botspring/types/Method'
import { routes } from '../config/routes'

// Webhooks are available at path `/webhook`
export const webhooks = Router()

// Attach middleware
// Authenticate with JWT
webhooks.use(jwt({ algorithms: ['HS256'], ...jwtConfig }))

// Attach routes
const paths = Object.keys(routes)
paths.forEach(path => {
  const route = routes[path]
  const methods = Object.keys(route) as Method[]
  methods.forEach(method => {
    const handler = route[method]
    if (!!handler) {
      webhooks[method](path, handler)
    }
  })
})
