import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import getNotes from '../../prisma/getNotes';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, trashed } = req.body;

    if (trashed) {
        // permanently delete note
        await prisma.note.delete({
            where: { id: Number(id) }
        });
    } else {
        // update note to be trashed
        await prisma.note.update({
            where: { id: Number(id) },
            data: {
                deleted: true,
                deletedAt: new Date()
            }
        });
    }

    const response = await getNotes();

    res.json({
        newNote: null,
        ...response
    });
}
