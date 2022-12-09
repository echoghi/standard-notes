import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password, salt } = req.body;

    let user;

    try {
        user = await prisma.user.create({
            data: {
                email,
                password,
                salt
            }
        });
    } catch (e) {
        console.log(e);
        res.status(401);
        res.json({ error: 'User already exists' });
        return;
    }

    const token = jwt.sign(
        {
            email: user.email,
            id: user.id,
            time: Date.now()
        },
        password,
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
};
