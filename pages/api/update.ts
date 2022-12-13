import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, data } = req.body;
    const { proof, _sn_session } = req.cookies;

    const { id: userId } = jwt.verify(_sn_session, proof);

    const newNote = await prisma.note.update({
        where: { id },
        data: {
            ...data,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });

    await prisma.user.update({
        where: { id: userId },
        data: {
            updatedAt: new Date()
        }
    });

    res.json(newNote);
}
