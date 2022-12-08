import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

// write a next js api route to update a note
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, title, content } = req.body;

    let newNote;

    if (id) {
        newNote = await prisma.note.update({
            where: { id: Number(id) },
            data: { title, content, updatedAt: new Date() }
        });
    } else {
        newNote = await prisma.note.create({
            data: { title, content, createdAt: new Date(), updatedAt: new Date() }
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
