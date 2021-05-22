import { SignOptions } from 'jsonwebtoken'

type Config = SignOptions & { secret: string | Buffer }

export const jwtConfig: Config = {
  secret: Buffer.from(process.env.JWT_SECRET!, 'base64'),
  audience: 'botspring',
  issuer: 'botspring',
}
