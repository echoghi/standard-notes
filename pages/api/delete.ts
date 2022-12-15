import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { validateRoute } from '../../lib/auth';
import { User } from '../../types';

export default validateRoute(async function handle(req: NextApiRequest, res: NextApiResponse, user: User) {
    const { id, trashed } = req.body;
    const userId = user.id;

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
                // @ts-ignore
                deleted: true,
                deletedAt: new Date(),
                user: {
                    connect: {
                        // @ts-ignore
                        id: userId
                    }
                }
            }
        });
    }

    // upadte the lastUpdated field on the user
    await prisma.user.update({
        // @ts-ignore
        where: { id: userId },
        data: {
            // @ts-ignore
            updatedAt: new Date()
        }
    });

    res.json(newNote || { message: 'success' });
});
