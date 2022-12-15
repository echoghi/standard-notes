import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { validateRoute } from '../../lib/auth';
import { User } from '../../types';

export default validateRoute(async function handle(req: NextApiRequest, res: NextApiResponse, user: User) {
    const userId = user.id;

    // empty the trashed notes
    await prisma.note.deleteMany({
        where: {
            AND: [
                {
                    user: {
                        // @ts-ignore
                        id: userId
                    }
                },
                {
                    // @ts-ignore
                    deleted: true
                }
            ]
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

    res.json({ message: 'success' });
});
