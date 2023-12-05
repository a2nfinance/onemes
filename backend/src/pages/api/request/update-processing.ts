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
                const ids = req.body;

                await Request.updateMany(
                    { _id: { $in: ids } },
                    { $set: { status: 3 } },
                    { multi: true }
                )

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
