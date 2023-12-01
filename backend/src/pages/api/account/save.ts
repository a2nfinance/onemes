import connect from '@/database/connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import Account from "@/database/models/account";
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
                const account = new Account(req.body);
                await account.save();
                res.status(200).send({ success: true });
            } else {
                res.status(422).send({ success: false });
            }
        } else {
            res.status(422).send({ success: false });
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
}

export default connect(handler);