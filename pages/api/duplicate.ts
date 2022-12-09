import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.body;

    // find note by id
    const noteToDuplicate = await prisma.note.findUnique({
        where: { id: Number(id) }
    });

    // destructure note data without deletedAt or id fields
    const { id: noteId, deletedAt: noteDeletedAt, ...noteData } = noteToDuplicate;

    const newNote = await prisma.note.create({
        data: { ...noteData }
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
