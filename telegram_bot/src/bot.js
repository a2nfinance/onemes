const TelegramBot = require('node-telegram-bot-api');
const {searchAccounts, saveTransferRequest} = require("./core/account");
require("dotenv").config();

const token = process.env.API_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Thank you for using OneMes. You can use '/search' to search any OneMes account and '/transfer' to transfer token.");
});


bot.onText(/\/search (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; 
    searchAccounts(resp).then(data => {
        console.log(data);
        bot.sendMessage(chatId, `${data}`);
    }).catch((e) => {
        console.log(e);
        bot.sendMessage(chatId, `Could not found information of account ${resp}`);
    })
    
});

bot.onText(/\/transfer (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; 

    saveTransferRequest(msg.from.id, resp, chatId).then(data => {
        bot.sendMessage(chatId, `${data}`);
    }).catch((e) => {
        console.log(e);
        bot.sendMessage(chatId, `Could not found information of account ${resp}`);
    })
    
});

bot.on('message', (msg, meta) => {
    // const chatId = msg.chat.id;
    // const userId = msg.from.id;
});