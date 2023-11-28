// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  success: boolean
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    try {
        if (req.method === 'POST') {
            // need to validate
            if (req.body) {
                console.log("Body Data:", req.body)
                res.status(200).send({success: true});
            } else {
                res.status(422).send({success: false});
            }
        } else {
            res.status(422).send({success: false});
        }
    } catch(e) {
        res.status(500).send(e.message);
    }
}
