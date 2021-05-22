import { v4 as uuid } from 'uuid'
import { sign } from 'jsonwebtoken'
import type { JwtPayload } from '@botspring/types'

export const getJwt = (subject: string, payload: JwtPayload) => {
  try {
    const {
      jwtConfig: { secret, ...config },
    } = require('@botspring/config/jwt')
    const options = { ...config, subject, jwtid: uuid() }
    const token = sign(payload, secret, options)
    return token
  } catch (err) {
    console.error(err)
  }
}
