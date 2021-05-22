# 🤖 BotSpring

Internal Slack bot: semi-sentient, fully-annoying

[See app in Slack »](https://bigspring-io.slack.com/archives/D022HRW90R4)

## 🛠 Development

1. Make sure you've followed the [BigSpring monorepo setup](https://github.com/bigspring-io/bigspring/blob/development/docs/getting-started.md#-setting-up-the-repository) instructions to install Node.js and build the [`bigspring/node:1.1.0`](https://github.com/bigspring-io/bigspring/blob/development/docker/Dockerfile) Docker image.
2. [Download and setup ngrok](https://ngrok.com/)
3. Install npm dependencies:

   ```bash
   yarn install
   ```

4. Rename [`.env.example`](.env.example) to `.env` and fill in the tokens as needed from [1Password](https://bigspringskills.1password.com), [Slack](https://api.slack.com/apps/A022MG521QV), or other necessary APIs.
5. Start Docker containers with hot reloading:

   ```bash
   yarn start -d
   ```

### Visual Studio Code Setup

#### Hidden Files

This project contains various configuration files and build directories that are selectively hidden from VS Code. You can show them by modifying the `files.exclude` booleans in [`.vscode/settings.json`](.vscode/settings.json).

#### Plugins

The following VS Code plugins are recommended to take advantage of this project's tooling. Source files are set to format with [Prettier](https://prettier.io) on save.

- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Conventional Commits](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits)

## 📦 Deployment

BotSpring is a [Serverless Framework](https://www.serverless.com) function deployed on [AWS Lambda](https://aws.amazon.com/lambda). [GitHub Actions](https://github.com/features/actions) will automatically build, test, and deploy BotSpring when pushing to `main`. To deploy from your local environment:

1. [Authenticate](https://serverless.com/framework/docs/providers/aws/guide/credentials/) using the `Serverless AWS User` in 1Password.
2. Deploy with [Serverless](https://www.serverless.com):

   ```bash
   yarn deploy
   ```
