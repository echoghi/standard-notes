import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, newId } = req.body;

    const { proof, _sn_session } = req.cookies;

    const { id: userId } = jwt.verify(_sn_session, proof);

    // find note by id
    const noteToDuplicate = await prisma.note.findUnique({
        where: { id }
    });

    // destructure note data without deletedAt or id fields
    const { id: noteId, deletedAt: noteDeletedAt, userId: noteUserId, ...noteData } = noteToDuplicate;

    const newNote = await prisma.note.create({
        data: {
            ...noteData,
            id: newId,
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });

    await prisma.user.update({
        where: { id: userId },
        data: {
            updatedAt: new Date()
        }
    });

    res.json(newNote);
}
