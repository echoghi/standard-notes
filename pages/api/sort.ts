import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { validateRoute } from '../../lib/auth';
import { User } from '../../types';

export default validateRoute(async function handle(req: NextApiRequest, res: NextApiResponse, user: User) {
    const { sort } = req.body;
    const userId = user.id;
    const updatedUser = await prisma.user.update({
        // @ts-ignore
        where: { id: userId },
        data: {
            // @ts-ignore
            sort
        }
    });
    res.json(updatedUser);
});
