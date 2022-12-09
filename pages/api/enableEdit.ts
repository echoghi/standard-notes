import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import getNotes from '../../prisma/getNotes';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, editEnabled, userId } = req.body;

    const newNote = await prisma.note.update({
        where: { id: Number(id) },
        data: {
            editEnabled,
            user: {
                connect: {
                    id: Number(userId)
                }
            }
        }
    });

    const response = await getNotes(userId);

    res.json({
        newNote,
        ...response
    });
}
