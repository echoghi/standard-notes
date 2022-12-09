import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import getNotes from '../../prisma/getNotes';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.body;
    // empty the trashed notes
    await prisma.note.deleteMany({
        where: {
            AND: [
                {
                    user: {
                        id: Number(userId)
                    }
                },
                {
                    deleted: true
                }
            ]
        }
    });

    const response = await getNotes(userId);

    res.json({
        ...response
    });
}
