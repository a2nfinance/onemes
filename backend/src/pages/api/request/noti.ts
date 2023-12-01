// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Request from "@/database/models/request";
import connect from '@/database/connect';
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
                console.log("Body Data:", req.body);
                const ids = req.body;
                for (let i = 0; i < ids.length; i++) {
                    console.log(ids[i], " processing")
                    let rq = await Request.findByIdAndUpdate(ids[i], {
                        status: 1
                    })
                    console.log(rq);
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
