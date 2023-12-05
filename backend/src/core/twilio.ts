import dotenv from "dotenv";
import { Twilio } from "twilio";

dotenv.config();
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMSMessage = (requestId: string, sender: string, status: number) => {
    if(status) {
        client.messages.create({
            body: `Your token transfer was successful with the request ID #${requestId}`,
            from: process.env.TWILIO_GLOBAL_NUMBER,
            to: sender
        })
    } else {

        client.messages.create({
            body: `Token transfer with request ID #${requestId} failed. Please attempt the transfer again.`,
            from: process.env.TWILIO_GLOBAL_NUMBER,
            to: sender
        })
    }
}