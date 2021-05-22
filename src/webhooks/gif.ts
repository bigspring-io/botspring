import type { RequestHandler } from 'express'
import { getRandomGif } from '@botspring/utils/getRandomGif'

export const gifHandler: RequestHandler = async (_, res) => {
  // Get GIF url
  const { url } = await getRandomGif()
  if (!url) {
    throw new Error('GIPHY request failed')
  }
  // Redirect to GIF
  res.redirect(url)
}
