import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { User } from '../../types';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { email } = req.body;

    const user = <User | null>await prisma.user.findUnique({
        where: { email }
    });

    if (user) {
        res.json({ salt: user.salt, id: user.id });
    } else {
        res.status(401).json({ error: 'Account not found' });
    }
};
