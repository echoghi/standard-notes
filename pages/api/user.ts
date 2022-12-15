import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { validateRoute } from '../../lib/auth';
import { User } from '../../types';

export default validateRoute(async function handle(req: NextApiRequest, res: NextApiResponse, user: User) {
    const userId = user.id;

    const activeUser = await prisma.user.findUnique({
        // @ts-ignore
        where: { id: userId }
    });

    res.json(activeUser);
});
