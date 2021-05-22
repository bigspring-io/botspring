import type { sign } from 'jsonwebtoken'

export type JwtPayload = Parameters<typeof sign>[0]
