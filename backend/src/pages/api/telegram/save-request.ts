import connect from '@/database/connect';
import type { NextApiRequest, NextApiResponse } from 'next';
import Request from "@/database/models/request";

type Data = {
    success: boolean,
    request?: any
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        if (req.method === 'POST') {
            // need to validate
            if (req.body) {
                console.log("Body Data:", req.body);
                // Search Database and reply if there is no reciever account found

                // Save request to database

                let request = new Request(req.body);

                await request.save();
                res.status(200).send({ success: true, request: request });
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