import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    // empty the trashed notes
    await prisma.note.deleteMany({
        where: {
            deleted: true
        }
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

    res.json({
        notes,
        starred,
        deleted: [],
        starredCount: starred.length,
        deletedCount: 0,
        notesCount: notes.length
    });
}
