require("dotenv").config();

//MAX api
const { MaxApi } = require('@maxhub/max-bot-api');
//import { MaxApi } from '@maxhub/max-bot-api';

const token = process.env.MAX_API_TOKEN

const bot = new MaxApi(token);

// Обработчик для команды '/start'
bot.command('start', (ctx) => ctx.reply('Добро пожаловать!'));

// Установка подсказок с доступными командами
bot.api.setMyCommands([
  { 
    name: 'ping',
    description: 'Сыграть в пинг-понг'
  },
]);

// Обработчик события запуска бота
bot.on('bot_started', (ctx) => ctx.reply('Привет! Отправь мне команду /ping, чтобы сыграть в пинг-понг'));

// Обработчик команды '/ping'
bot.command('ping', (ctx) => ctx.reply('pong'));

// Обработчик для сообщения с текстом 'hello'
bot.hears('hello', (ctx) => ctx.reply('world'));

// Обработчик для всех остальных входящих сообщений
bot.on('message_created', (ctx) => ctx.reply(ctx.message.body.text));

bot.start();