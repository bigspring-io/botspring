require('dotenv').config()
import { requiredVariables } from '@botspring/config'

// Checked all required variables when run from CLI
export const checkVariable = (variable: string) => {
  if (process.env[variable]) {
    console.info('✅', variable)
  } else {
    console.error(`Environment variable ${variable} is missing.`)
    process.exit(1)
  }
}

export const checkVariables = (variables: string[]) =>
  variables.forEach(checkVariable)

if (require.main === module) {
  checkVariables(requiredVariables)
}
