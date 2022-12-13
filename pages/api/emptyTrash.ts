import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { proof, _sn_session } = req.cookies;

    const { id: userId } = jwt.verify(_sn_session, proof);

    // empty the trashed notes
    await prisma.note.deleteMany({
        where: {
            AND: [
                {
                    user: {
                        id: userId
                    }
                },
                {
                    deleted: true
                }
            ]
        }
    });

    res.json({ message: 'success' });
}
