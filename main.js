//-----------------------------------//
//-----GENERAL CONFIG OF THE BOT-----//
//-----------------------------------//

//Config of the .env file
require('dotenv').config()
const dotenv = require('dotenv')

//Config of the bot 
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_API_KEY;
const bot = new TelegramBot(token,{polling: true});

//config of the anime scrapper
const axios = require('axios');

//-----------------------------------//
//--------Imported functions---------//
//----------and commands-------------//
//-----------------------------------//


// var following_info = require('./commands/following.js')
var scraper = require('./commands/scraper.js')
var user = require('./commands/user.js')


//-----------------------------------//
//-----------Commmands bot-----------//
//-----------------------------------//


//Made like "/\/command/"

bot.onText(/\/start/, (msg) => {
    user.add(bot, msg);
});

bot.onText(/\/siguiendo/, (msg) => {
    user.siguiendo(bot, msg);
});

bot.onText(/\/seguir (.+)/, (msg, match) => {
    const anime = match[1];
    user.seguir(bot, msg, anime);
})

bot.onText(/\/quitar (.+)/, (msg, match) => {
    const anime = match[1];
    user.quitar(bot, msg, anime);
})

bot.onText(/\/info (.+)/, (msg, match) => {
    const anime = match[1];
    user.info(bot, msg, anime);
})

//-----------------------------------//
//---------Constant Listener---------//
//-----------------------------------//


//Made like bot.on('type of input', (msg))

bot.on('text', (msg) => { //Example of how could it be
    const chatId = msg.chat.id;
    const message = msg.text.toLowerCase();
    if (message == 'ping'){
        bot.sendMessage(chatId, 'pong');
    }
    else if(message == 'pong'){
        bot.sendMessage(chatId, 'ping');
    }
});


//-----------------------------------//
//-------------TIMERS----------------//
//-----------------------------------//

//Config time refresh

var alert_time = 17 * 60000; //el primer número son los minutos
var main_scrape_time = 15 * 60000;

var user_alert = setInterval(function(){
    user.alert(bot)
},alert_time);

var main_scrape = setInterval(function(){
    scraper.indexScraper()
},main_scrape_time);

