import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import getNotes from '../../prisma/getNotes';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, userId } = req.body;

    // find note by id
    const noteToDuplicate = await prisma.note.findUnique({
        where: { id: Number(id) }
    });

    // destructure note data without deletedAt or id fields
    const { id: noteId, deletedAt: noteDeletedAt, userId: noteUserId, ...noteData } = noteToDuplicate;

    const newNote = await prisma.note.create({
        data: {
            ...noteData,
            user: {
                connect: {
                    id: Number(userId)
                }
            }
        }
    });

    const response = await getNotes(userId);

    res.json({
        newNote,
        ...response
    });
}
