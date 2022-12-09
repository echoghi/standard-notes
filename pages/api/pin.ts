import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import getNotes from '../../prisma/getNotes';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, pinned } = req.body;

    const newNote = await prisma.note.update({
        where: { id: Number(id) },
        data: { pinned }
    });

    const response = await getNotes();

    res.json({
        newNote,
        ...response
    });
}
