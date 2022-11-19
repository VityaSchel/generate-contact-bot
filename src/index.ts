import './env.js'
import TelegramBot, { User } from 'node-telegram-bot-api'
import { t } from './localization/index.js'
import _ from 'lodash'
import clone from 'just-clone'
import fetch from 'node-fetch'
import vcardsJS from 'vcards-js'

type Scene = 'main_menu' | 'fill_start' | 'fill_name' | 'fill_phone' | 'fill_photo'
type FormData = {
  /** Contact's name */
  name: string
  /** Contact's phone number */
  phone: string
  /** Contact's photo encoded with base64 (<=1kb) */
  photo: string | null
}
const scenes: { [key: User['id']]: Scene } = {}
const forms: { [key: User['id']]: FormData } = {}

if(!process.env.TELEGRAM_BOT_API_TOKEN) throw new Error('Fill "TELEGRAM_BOT_API_TOKEN" env variable!')
const bot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN, { polling: true })

bot.on('message', e => {
  if(!e.from || e.from.is_bot || e.chat.type !== 'private') return

  const answer = (text: string) => bot.sendMessage(e.chat.id, text, { parse_mode: 'HTML' })

  if(e.text === '/start') {
    scenes[e.from.id] = 'main_menu'
  } else if(e.text === '/create') {
    scenes[e.from.id] = 'fill_start'
  } else if(e.text === '/cancel') {
    scenes[e.from.id] = 'main_menu'
    answer(t('operation_cancelled', e.from.language_code))
    return
  } 

  const nameRegex = /^(.+) ([^ ]+)$/
  const sendResult = async () => {
    if(!e.from) return
    const formData = forms[e.from.id]
    if(!formData) return
    const [, first_name, last_name] = formData.name.match(nameRegex) as [any, string, string]
    console.log(formData)
    try {
      let vcard: string | undefined
      if(formData.photo) {
        const vcardObject = vcardsJS()
        vcardObject.photo.embedFromString(formData.photo, 'JPEG')
        vcard = vcardObject.getFormattedString()
      }
      await bot.sendContact(e.chat.id, formData.phone, first_name, { last_name, vcard })
      await answer(t('screens.contact_data_fill.result', e.from.language_code))
    } catch(e) {
      // if(e.message === 'ETELEGRAM: 400 Bad Request: wrong phone number specified') {

      // }
      await answer(t('contact_invalid_error', e.from.language_code))
    }
    scenes[e.from.id] = 'main_menu'
  }

  switch(scenes[e.from.id]) {
    case 'fill_start':
      answer(t('screens.contact_data_fill.fill_name', e.from.language_code))
      scenes[e.from.id] = 'fill_name'
      break

    case 'fill_name':
      if(!e.text || !nameRegex.test(e.text)) {
        answer(t('screens.contact_data_fill.fill_name_error', e.from.language_code))
        return
      }
      _.set(forms, [e.from.id, 'name'], e.text)
      answer(t('screens.contact_data_fill.fill_phone', e.from.language_code))
      scenes[e.from.id] = 'fill_phone'
      break

    case 'fill_phone':
      _.set(forms, [e.from.id, 'phone'], e.text)
      answer(t('screens.contact_data_fill.fill_photo', e.from.language_code))
      scenes[e.from.id] = 'fill_photo'
      break

    case 'fill_photo':
      if(e.text === '/empty') {
        _.set(forms, [e.from.id, 'photo'], null)
        sendResult()
      } else {
        if(!e.photo) {
          answer(t('screens.contact_data_fill.fill_photo_error.no_photo', e.from.language_code))
          return
        } else {
          const photos = clone(e.photo)
          photos.sort((a, b) => b.width*b.height - a.width*a.height)
          const validPhoto = photos.find(photo => photo.file_size && photo.file_size < 1024)
          if(!validPhoto) {
            console.log(photos)
            answer(t('screens.contact_data_fill.fill_photo_error.invalid_photo', e.from.language_code))
            return
          } else {
            (async () => {
              if(!e.from) return
              try {
                const file = await bot.getFile(validPhoto.file_id)
                const response = await fetch(`https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_API_TOKEN}/${file.file_path}`)
                const buffer = await response.buffer()
                const base64 = await buffer.toString('base64')
                _.set(forms, [e.from.id, 'photo'], base64)
                sendResult()
              } catch(e) {
                console.error(e)
                answer(t('screens.contact_data_fill.fill_photo_error.invalid_photo', e.from.language_code))
                return
              }
            })()
          }
        }
      }
      break

    default:
    case 'main_menu':
      answer(t('screens.main_menu_greetings', e.from.language_code))
      break
  }
})