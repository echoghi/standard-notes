import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { validateRoute } from '../../lib/auth';
import { Note, User } from '../../types';

export default validateRoute(async function handle(req: NextApiRequest, res: NextApiResponse, user: User) {
    const { id, newId } = req.body;
    const userId = user.id;

    // find note by id
    const noteToDuplicate = <Note | null>await prisma.note.findUnique({
        where: { id }
    });

    if (noteToDuplicate) {
        // destructure note data without deletedAt or id fields
        const { id: noteId, deletedAt: noteDeletedAt, userId: noteUserId, ...noteData } = noteToDuplicate;

        const newNote = await prisma.note.create({
            data: {
                ...noteData,
                id: newId,
                user: {
                    connect: {
                        // @ts-ignore
                        id: userId
                    }
                }
            }
        });

        await prisma.user.update({
            // @ts-ignore
            where: { id: userId },
            data: {
                // @ts-ignore
                updatedAt: new Date()
            }
        });

        res.json(newNote);

        return;
    }

    res.status(404).json({ error: 'Note not found' });
});
