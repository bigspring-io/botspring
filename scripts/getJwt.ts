require('dotenv').config()
import prompt from 'prompt'
import { checkVariable } from './checkVariables'
import { getJwt } from '@botspring/utils'
import { JwtSubject } from '@botspring/types'

checkVariable('JWT_SET')

prompt.message = ''
prompt.delimiter = ':'

type Input = { subject: string; test: 'y' | 'Y' | 'n' | 'N' }

const getInput = async (): Promise<Input> => {
  const subjects = Object.values(JwtSubject)
  prompt.start()
  return prompt.get([
    {
      name: 'subject',
      description: 'Subject (unique)',
      pattern: new RegExp(`^(${subjects.join('|')})$`),
      message: `Subject must be one of: ${subjects.join(', ')}`,
      required: true,
    },
    {
      name: 'test',
      description: 'Is this a test token? (y/N)',
      pattern: /^[yYnN]$/,
      message: 'Please enter either y/Y or n/N',
      default: 'N',
    },
  ])
}

;(async () => {
  const { subject, test = 'N' } = await getInput()
  const payload = { test: test.toLowerCase() === 'y' }
  const token = getJwt(subject, payload)
  console.info()
  console.info(token)
})()
