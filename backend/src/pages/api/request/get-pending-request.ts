// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connect from '@/database/connect';
import type { NextApiRequest, NextApiResponse } from 'next'
import Request from "@/database/models/request";
type Data = {
    success: boolean,
    data?: any[]
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {

        // need to validate
        if (req.body) {
            // search data from account and request
            const requests = await Request.find({ status: 0 }).sort({ created_at: -1 });

            // aggregate data
            res.status(200).send({ success: true, data: requests });
        } else {
            res.status(422).send({ success: false });
        }

    } catch (e) {
        res.status(500).send(e.message);
    }
}

export default connect(handler);
