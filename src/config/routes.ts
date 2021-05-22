import type { Routes } from '@botspring/types/Routes'
import { gifHandler } from '@botspring/webhooks/gif'

export const routes: Routes = {
  '/gif': { get: gifHandler },
}
