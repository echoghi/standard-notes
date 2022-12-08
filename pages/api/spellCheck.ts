import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, spellCheck } = req.body;

    const newNote = await prisma.note.update({
        where: { id: Number(id) },
        data: { spellCheck }
    });

    const notes = await prisma.note.findMany({
        orderBy: {
            pinned: 'desc'
        }
    });

    const starred = await prisma.note.findMany({
        where: {
            starred: true
        }
    });

    const deleted = await prisma.note.findMany({
        where: {
            deleted: true
        }
    });

    res.json({
        notes,
        starred,
        deleted,
        newNote,
        starredCount: starred.length,
        deletedCount: deleted.length,
        notesCount: notes.length
    });
}
