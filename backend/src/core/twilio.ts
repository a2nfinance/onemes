import dotenv from "dotenv";
import { Twilio } from "twilio";

dotenv.config();
const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendSMSMessage = (requestId: string, sender: string, status: number) => {
    if(status) {
        client.messages.create({
            body: `Your token is transfered successful  (#${requestId})`,
            from: process.env.TWILIO_GLOBAL_NUMBER,
            to: sender
        })
    } else {

        client.messages.create({
            body: `Fail to transfer token (#${requestId}), please try again!`,
            from: process.env.TWILIO_GLOBAL_NUMBER,
            to: sender
        })
    }
}