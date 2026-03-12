require("dotenv").config();

//MAX api
const { Bot } = require('@maxhub/max-bot-api');
const express = require('express');
const https = require('https');
const fs = require('fs');

const token = process.env.MAX_API_TOKEN

const bot = new Bot(token);


//подключение к БД PostreSQL
const sequelize = require('./botmax/connections/db')
const { MaxUserBot } = require('./botmax/models/models');

// Certificate
const privateKey = fs.readFileSync('privkey.pem', 'utf8'); //fs.readFileSync('/etc/letsencrypt/live/proj.uley.team/privkey.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8'); //fs.readFileSync('/etc/letsencrypt/live/proj.uley.team/cert.pem', 'utf8');
const ca = fs.readFileSync('chain.pem', 'utf8'); //fs.readFileSync('/etc/letsencrypt/live/proj.uley.team/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const app = express();

const httpsServer = https.createServer(credentials, app);


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
bot.on('bot_started', async(ctx) => {
  console.log("ctx: ", ctx)

  const userId = ctx.user.user_id;
  const firstname = ctx.user.first_name
  const lastname = ctx.user.last_name
  const name = ctx.user.name
  const avatar = ctx.user.full_avatar_url

  ctx.reply('Привет! Отправь мне команду')
  
  //добавить пользователя в бд
  const user = await MaxUserBot.findOne({where:{chatId: userId.toString()}})
  if (!user) {
    await MaxUserBot.create({ firstname: firstname, lastname: lastname, chatId: userId, username: name  })
    console.log('Пользователь добавлен в БД')
  } else {
    console.log('Отмена добавления в БД. Пользователь уже существует')
  } 
});

// Обработчик для команды '/start'
//bot.command('start', (ctx) => ctx.reply('Добро пожаловать!'));

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

// Обработчик нажатия на callback-кнопку с указанным payload
bot.action('action_accept', async (ctx) => 
  {
    /* ... */
    setTimeout(()=> {
      ctx.reply('Ваша заявка принята!')
    }, 2000)
  }
);

bot.action('action_cancel', async (ctx) => 
  {
    /* ... */
    setTimeout(()=> {
      ctx.reply('Вы отклонили заявку!')
    }, 2000)
  }
);

//-----------------------------------------------------------------------------------------
// START (обработка команд и входящих сообщени от пользователя)
//-----------------------------------------------------------------------------------------

// Обработчик для любого другого сообщения
bot.on('message_created', async(ctx) => {
    //console.log("ctx: ", ctx)

    const chatId = ctx.message.sender.user_id;
    const firstname = ctx.message.sender.first_name
    const lastname = ctx.message.sender.last_name
    //const username = ctx.from.username
    const text = ctx.message ? ctx.message.body.text : ''
    //const messageId = msg.message_id

    //ctx.reply(text, chatId)
    
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
        } else {
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


//-------------------------------------------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 8081;

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        
        httpsServer.listen(PORT, async() => {
            console.log('HTTPS Server BotMax running on port ' + PORT);

        });

    } catch (error) {
        console.log('Подключение к БД сломалось!', error.message)
    }
}

start();

bot.start();