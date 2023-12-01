// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connect from '@/database/connect';
import type { NextApiRequest, NextApiResponse } from 'next'
import Account from "@/database/models/account";
type Data = {
    success: boolean,
    sender?: any,
    receiver?: any
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {

        // need to validate
        if (req.body) {
            // search data from account and request
            const senderQuery = req.body.senderQuery;
            const receiverQuery = req.body.receiverQuery;

            const sender = await Account.findOne(senderQuery[0]);
            const receiver = await Account.findOne(receiverQuery[0]);

            // aggregate data
            res.status(200).send({ success: true, sender: sender, receiver: receiver });
        } else {
            res.status(422).send({ success: false });
        }

    } catch (e) {
        res.status(500).send(e.message);
    }
}

export default connect(handler);
