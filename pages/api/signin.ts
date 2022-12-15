import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import prisma from '../../lib/prisma';
import { User } from '../../types';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, proof } = req.body;

    const user = <User | null>await prisma.user.findUnique({
        where: { email }
    });

    if (user && proof === user.proof) {
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                time: Date.now()
            },
            proof,
            { expiresIn: '7d' }
        );

        res.setHeader('Set-Cookie', [
            cookie.serialize('_sn_session', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production'
            }),
            cookie.serialize('proof', proof, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production'
            })
        ]);

        res.status(200).json(user);
    } else {
        res.status(401).json({ error: 'Incorrect login' });
    }
};
