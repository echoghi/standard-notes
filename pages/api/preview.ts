import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, preview, trashed } = req.body;

    let newNote;

    if (!trashed) {
        newNote = await prisma.note.update({
            where: { id: Number(id) },
            data: { preview }
        });
    } else {
        newNote = await prisma.deleted.update({
            where: { id: Number(id) },
            data: { preview }
        });
    }

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

    const deleted = await prisma.deleted.findMany({
        orderBy: {
            pinned: 'desc'
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
