import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

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

    const deleted = await prisma.note.findMany({
        where: {
            deleted: true
        }
    });

    res.json({
        notes,
        starred: starredNotes,
        deleted,
        newNote: null,
        starredCount: starredNotes.length,
        deletedCount: deleted.length,
        notesCount: notes.length
    });
}
