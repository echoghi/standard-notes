import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.cookies;
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

    res.json({ message: 'success' });
}
