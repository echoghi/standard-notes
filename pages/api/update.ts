import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { validateRoute } from '../../lib/auth';

export default validateRoute(async function handle(req: NextApiRequest, res: NextApiResponse, user: any) {
    const { id, data } = req.body;
    const userId = user.id;

    const newNote = await prisma.note.update({
        where: { id },
        data: {
            ...data,
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
            // @ts-ignore
            updatedAt: new Date()
        }
    });

    res.json(newNote);
});
