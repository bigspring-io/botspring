import { GiphyFetch } from '@giphy/js-fetch-api'

type RandomOptions = Parameters<GiphyFetch['random']>[0]
type Result = Promise<Partial<{ title: string; url: string }>>

const giphy = new GiphyFetch(process.env.GIPHY_API_KEY!)

export const getRandomGif = async (
  tagOrOptions?: RandomOptions | string
): Result => {
  try {
    const options: RandomOptions = {
      type: 'gifs',
      rating: 'g',
      ...(typeof tagOrOptions === 'string'
        ? { tag: tagOrOptions }
        : tagOrOptions),
    }
    const {
      data: {
        title,
        images: {
          original: { url },
        },
      },
    } = await giphy.random(options)
    return { title, url }
  } catch (err) {
    console.error('GIPHY error:', err)
    return {}
  }
}
