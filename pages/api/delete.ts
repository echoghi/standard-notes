import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, trashed } = req.body;
    const { proof, _sn_session } = req.cookies;

    const { id: userId } = jwt.verify(_sn_session, proof);

    let newNote = null;

    if (trashed) {
        // permanently delete note
        await prisma.note.delete({
            where: { id }
        });
    } else {
        // update note to be trashed
        newNote = await prisma.note.update({
            where: { id },
            data: {
                deleted: true,
                deletedAt: new Date(),
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    }

    // upadte the lastUpdated field on the user
    await prisma.user.update({
        where: { id: userId },
        data: {
            updatedAt: new Date()
        }
    });

    res.json(newNote);
}
