import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, starred, trashed } = req.body;

    let newNote;

    if (!trashed) {
        newNote = await prisma.note.update({
            where: { id: Number(id) },
            data: { starred }
        });
    } else {
        newNote = await prisma.deleted.update({
            where: { id: Number(id) },
            data: { starred }
        });
    }

    const notes = await prisma.note.findMany({
        orderBy: {
            pinned: 'desc'
        }
    });

    const starredNotes = await prisma.note.findMany({
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
        starred: starredNotes,
        deleted,
        newNote,
        starredCount: starredNotes.length,
        deletedCount: deleted.length,
        notesCount: notes.length
    });
}
