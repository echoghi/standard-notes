import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import getNotes from '../../prisma/getNotes';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.body;

    await prisma.note.update({
        where: { id: Number(id) },
        data: {
            deleted: false,
            deletedAt: null
        }
    });

    const response = await getNotes();

    res.json({
        newNote: null,
        ...response
    });
}
