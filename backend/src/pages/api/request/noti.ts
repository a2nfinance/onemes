// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Request from "@/database/models/request";
import connect from '@/database/connect';
import { sendNoti } from '@/core/telegram';
import { sendSMSMessage } from '@/core/twilio';
type Data = {
    success: boolean
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        if (req.method === 'POST') {
            // need to validate
            if (req.body) {
                console.log("Results:", req.body);
                const results = JSON.parse(req.body);
                const ids = results.map(r => r.split("_"));
                for (let i = 0; i < ids.length; i++) {
                    try {
                        let request = await Request.findOneAndUpdate({_id: ids[i][0], status: 0}, {
                            status: ids[i][1] === "1" ? 1 : 2
                        });
                        
                        if (request && request.type === 2) {
                            sendNoti(ids[i][0], request.sender, parseInt(ids[i][1]));
                        }
    
                        if (request && request.type === 1) {
                            sendSMSMessage(ids[i][0], request.sender, parseInt(ids[i][1]));
                        }
                    } catch(e) {
                        console.log(e);
                    }
                   

                }
                res.status(200).send({ success: true });
            } else {
                res.status(422).send({ success: false });
            }
        } else {
            res.status(422).send({ success: false });
        }
    } catch (e) {
        res.status(500).send(e.message);
    }
}

export default connect(handler);
