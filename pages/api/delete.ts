import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, title, content, pinned, starred, updatedAt, createdAt, trashed } = req.body;

    if (trashed) {
        // delete note from deleted table
        await prisma.deleted.delete({
            where: { id: Number(id) }
        });
    } else {
        // delete note by id
        await prisma.note.delete({
            where: { id: Number(id) }
        });

        // add the note to the deleted table with the deletedAt timestamp
        await prisma.deleted.create({
            data: {
                id: Number(id),
                title,
                content,
                pinned,
                starred,
                updatedAt,
                createdAt,
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

    const deleted = await prisma.deleted.findMany({
        orderBy: {
            pinned: 'desc'
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
