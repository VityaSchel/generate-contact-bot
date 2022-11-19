import './.env'
import TelegramBot, { User } from 'node-telegram-bot-api'

type Scene = 'main_menu' | 'name'
const scenes: { [key: User['id']]: Scene } = {}

if(!process.env.TELEGRAM_BOT_API_TOKEN) throw new Error('Fill "TELEGRAM_BOT_API_TOKEN" env variable!')
const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, { polling: true })

bot.on('message', e => {
  if(!e.from || e.from.is_bot || e.chat.type !== 'private') return

  switch(scenes[e.from.id]) {
    default:
    case 'main_menu':
      bot.sendMessage()
  }
})