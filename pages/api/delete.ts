import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, trashed } = req.body;
    const { userId } = req.cookies;

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

    res.json(newNote);
}
