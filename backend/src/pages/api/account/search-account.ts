// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connect from '@/database/connect';
import type { NextApiRequest, NextApiResponse } from 'next'
import Account from "@/database/models/account";
type Data = {
    success: boolean,
    accounts?: any[]
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {

        // need to validate
        if (req.body) {
            // search account
            const accounts = await Account.find(req.body);
            // aggregate data
            res.status(200).send({ success: true, accounts: accounts });
        } else {
            res.status(422).send({ success: false });
        }

    } catch (e) {
        res.status(500).send(e.message);
    }
}

export default connect(handler);
