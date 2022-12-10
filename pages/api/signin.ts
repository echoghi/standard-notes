import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, proof } = req.body;

    const user = await prisma.user.findUnique({
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
            { expiresIn: '8h' }
        );

        res.setHeader(
            'Set-Cookie',
            cookie.serialize('APP_ACCESS_TOKEN', token, {
                httpOnly: true,
                maxAge: 8 * 60 * 60,
                path: '/',
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production'
            })
        );

        res.json(user);
    } else {
        res.status(401);
        res.json({ error: 'Incorrect login' });
    }
};
