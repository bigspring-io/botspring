import type { RequestHandler } from 'express'
import { Method } from './Method'

export type Routes = {
  [path: string]: {
    [method in Method]?: RequestHandler
  }
}
