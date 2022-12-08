import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { title, content } = req.body;
    const newNote = await prisma.note.create({
        data: { title, content, createdAt: new Date(), updatedAt: new Date() }
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
