import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, data } = req.body;
    const { userId } = req.cookies;

    const newNote = await prisma.note.update({
        where: { id: Number(id) },
        data: {
            ...data,
            user: {
                connect: {
                    id: Number(userId)
                }
            }
        }
    });

    res.json(newNote);
}
