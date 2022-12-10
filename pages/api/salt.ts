import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (user) {
        res.json(user.salt);
    } else {
        res.status(401);
        res.json({ error: 'Account not found' });
    }
};
//
