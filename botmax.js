require("dotenv").config();

//MAX api
const { Bot } = require('@maxhub/max-bot-api');

const token = process.env.MAX_API_TOKEN

const bot = new Bot(token);

// Обработчик для команды '/start'
bot.command('start', (ctx) => ctx.reply('Добро пожаловать!'));

// Установка подсказок с доступными командами
bot.api.setMyCommands([
  { 
    name: 'menu',
    description: 'Меню'
  },
  { 
    name: 'info',
    description: 'Информация'
  },
]);

// Обработчик события запуска бота
//bot.on('bot_started', (ctx) => ctx.reply('Привет! Отправь мне команду /ping, чтобы сыграть в пинг-понг'));

// Обработчик команды '/info'
bot.command('info', (ctx) => 
  ctx.reply('Информация')    
);

// Обработчик команды '/menu'
bot.command('menu', (ctx) => 
  ctx.reply('Меню')
);

// Обработчик для сообщения с текстом 'hello'
bot.hears('hello', (ctx) =>
   ctx.reply('world')
);

// Обработчик для всех остальных входящих сообщений
//bot.on('message_created', (ctx) => ctx.reply(ctx.message.body.text));

// Обработчик для любого другого сообщения
bot.on('message_created', (ctx) => {
    ctx.reply(ctx.message.body.text)
    const message = ctx.message; // Полученное сообщение
    console.log(message)
});


bot.start();