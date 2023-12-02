import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv"
dotenv.config();

const token = process.env.API_TOKEN;
const bot = new TelegramBot(token, { polling: false });
export const sendNoti = (requestId: string, sender: string, status: number) => {

    if(status) {
        bot.sendMessage(sender, `Your token is transfered successful  (#${requestId})`);
       
    } else {
        bot.sendMessage(sender, `Fail to transfer token (#${requestId}), please try again!`);
    }
}