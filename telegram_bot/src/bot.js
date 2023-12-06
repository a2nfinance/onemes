const TelegramBot = require('node-telegram-bot-api');
const {searchAccounts, saveTransferRequest} = require("./core/account");
require("dotenv").config();

const token = process.env.API_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Thank you for being a part of OneMes. Feel free to utilize '/search' to find any OneMes account and '/transfer' to initiate token transfers.\n\n For same-chain transfers, you can use '/transfer TR {token name} {token amount} {receiver account}'.\n\n If you prefer cross-chain transfers, employ '/transfer CTR {source chain name} {token name} {token amount} {destination chain} {receiver account}'.\n\n Here's an example:\n - /transfer TR avax 0.001 levi.onemes \n - /transfer CTR sepolia CCIP-BnM 0.0001 fuji levi01@a2n.finance.");
});


bot.onText(/\/search (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; 
    searchAccounts(resp).then(data => {
        console.log(data);
        bot.sendMessage(chatId, `${data}`);
    }).catch((e) => {
        console.log(e);
        bot.sendMessage(chatId, `Account ${resp} information not found.`);
    })
    
});

bot.onText(/\/transfer (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; 

    saveTransferRequest(msg.from.id, resp, chatId).then(data => {
        bot.sendMessage(chatId, `${data}`);
    }).catch((e) => {
        console.log(e);
        bot.sendMessage(chatId, `Account ${resp} information not found.`);
    })
    
});

bot.on('message', (msg, meta) => {
    // const chatId = msg.chat.id;
    // const userId = msg.from.id;
});