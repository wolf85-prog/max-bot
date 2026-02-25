require("dotenv").config();

//MAX api
const { Bot } = require('@maxhub/max-bot-api');

const token = process.env.MAX_API_TOKEN

const bot = new Bot(token);


//подключение к БД PostreSQL
const sequelize = require('./botmax/connections/db')
const { MaxUserBot } = require('./botmax/models/models');


// Обработчик для команды '/start'
// bot.command('start', async(ctx) => 
//   {
//     //добавить пользователя в бд
//     const user = await MaxUserBot.findOne({where:{chatId: chatId.toString()}})
//     if (!user) {
//       await UserBot.create({ firstname: firstname, lastname: lastname, chatId: chatId, username: username })
//       console.log('Пользователь добавлен в БД')
//     } else {
//       console.log('Отмена добавления в БД. Пользователь уже существует')
//     }

//   }
// );

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


//-----------------------------------------------------------------------------------------
// START (обработка команд и входящих сообщени от пользователя)
//-----------------------------------------------------------------------------------------

// Обработчик для любого другого сообщения
bot.on('message_created', async(ctx) => {
  console.log("ctx: ", ctx)
    //ctx.reply(ctx.message.body.text)
    const chatId = ctx.message.sender.user_id;
    const firstname = ctx.message.sender.first_name
    const lastname = ctx.message.sender.last_name
    //const username = ctx.from.username
    const message = ctx.message ? ctx.message.body.text : ''
    //const messageId = msg.message_id
    
    try {
        // команда Старт
        if (text === '/start') {
          //добавить пользователя в бд
          const user = await MaxUserBot.findOne({where:{chatId: chatId.toString()}})
          if (!user) {
            await MaxUserBot.create({ firstname: firstname, lastname: lastname, chatId: chatId, username: '' })
            console.log('Пользователь добавлен в БД')
          } else {
            console.log('Отмена добавления в БД. Пользователь уже существует')
          }
        }
    //-----------------------------------------------------------------------------------------------

    } catch (error) {
        console.log('Произошла непредвиденная ошибка! ', error.message)
    }
});


bot.start();