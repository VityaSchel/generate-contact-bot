import { Paths } from '../utils'
import _ from 'lodash'

type Locale = {
  screens: {
    main_menu_greetings: string
    contact_data_fill: {
      fill_name: string
      fill_name_error: string
      fill_photo: string
      fill_photo_error: {
        no_photo: string
        invalid_photo: string
      }
      fill_phone: string
      result: string
    }
  }
  contact_invalid_error: string
  operation_cancelled: string
}

export const ru: Locale = {
  screens: {
    main_menu_greetings: 'Привет! Этот бот поможет тебе создать контакт с любой информацией. Чтобы начать — введи команду /create\n\nАвтор: @hlothdev\nКод: https://github.com/vityaschel/generate-contact-bot',
    contact_data_fill: {
      fill_name: '<b>Создание контакта [1/4]</b>\n〰️〰️〰️〰️〰️\nОтправь название для контакта. \nНапример, «<pre>Виктор Щелочков</pre>»',
      fill_name_error: '<b>Создание контакта [1/4] -> Ошибка!</b>\n〰️〰️〰️〰️〰️\nНекорректный формат имени, попробуй еще раз. Отправь название для контакта. \nНапример, «<pre>Виктор Щелочков</pre>»',
      fill_phone: '<b>Создание контакта [2/4]</b>\n〰️〰️〰️〰️〰️\nОтправь телефон для контакта. \nНапример, «<pre>+79019404698</pre>»',
      fill_photo: '<b>Создание контакта [3/4]</b>\n〰️〰️〰️〰️〰️\nОтправь фото для контакта как "Фото" (не документ). Размер не должен превышать 1.5 КБ. \nИли отправь /empty, чтобы создать контакт без фото.',
      fill_photo_error: {
        no_photo: '<b>Создание контакта [3/4] -> Ошибка!</b>\n〰️〰️〰️〰️〰️\nОтправь мне фото для контакта или отправь /empty, чтобы создать контакт без фото.',
        invalid_photo: '<b>Создание контакта [3/4] -> Ошибка!</b>\n〰️〰️〰️〰️〰️\nНе удалось преобразовать твое фото в формат vCard, попробуй другое фото.',
      },
      result: '<b>Создание контакта [4/4]</b>\n〰️〰️〰️〰️〰️\nГотово! Нажми на сообщение выше, выбери «Переслать», выбери нужный чат и отметь опцию «Скрыть имя отправителя»'
    }
  },
  contact_invalid_error: 'Не удалось создать контакт. Проверь правильность введенных данных и попробуй ее раз.',
  operation_cancelled: 'Команда отменена.'
}

export const en: Locale = {
  screens: {
    main_menu_greetings: 'Привет! Этот бот поможет тебе создать контакт с любой информацией. Чтобы начать — введи команду /create\n\nАвтор: @hlothdev\nКод: https://github.com/vityaschel/generate-contact-bot',
    contact_data_fill: {
      fill_name: '<b>Создание контакта [1/4]</b>\n〰️〰️〰️〰️〰️\nОтправь название для контакта. \nНапример, «<pre>Виктор Щелочков</pre>»',
      fill_name_error: '<b>Создание контакта [1/4] -> Ошибка!</b>\n〰️〰️〰️〰️〰️\nНекорректный формат имени, попробуй еще раз. Отправь название для контакта. \nНапример, «<pre>Виктор Щелочков</pre>»',
      fill_phone: '<b>Создание контакта [2/4]</b>\n〰️〰️〰️〰️〰️\nОтправь телефон для контакта. \nНапример, «<pre>+79019404698</pre>»',
      fill_photo: '<b>Создание контакта [3/4]</b>\n〰️〰️〰️〰️〰️\nОтправь фото для контакта как "Фото" (не документ). Размер не должен превышать 1 КБ. \nИли отправь /empty, чтобы создать контакт без фото.',
      fill_photo_error: {
        no_photo: '<b>Создание контакта [3/4] -> Ошибка!</b>\n〰️〰️〰️〰️〰️\nОтправь мне фото для контакта или отправь /empty, чтобы создать контакт без фото.',
        invalid_photo: '<b>Создание контакта [3/4] -> Ошибка!</b>\n〰️〰️〰️〰️〰️\nНе удалось преобразовать твое фото в формат vCard, попробуй другое фото.',
      },
      result: '<b>Создание контакта [4/4]</b>\n〰️〰️〰️〰️〰️\nГотово! Нажми на сообщение выше, выбери «Переслать», выбери нужный чат и отметь опцию «Скрыть имя отправителя»'
    }
  },
  contact_invalid_error: 'Не удалось создать контакт. Проверь правильность введенных данных и попробуй ее раз.',
  operation_cancelled: 'Команда отменена.'
}

export function t(key: Paths<Locale>, localeCode?: string): string {
  const locale = localeCode ? {
    ru: ru,
  }[localeCode] ?? en : en
  return _.at(locale, key)[0] as string
}