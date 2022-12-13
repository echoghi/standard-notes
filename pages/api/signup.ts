import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import prisma from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, proof, salt, id } = req.body;

    let user;

    try {
        user = await prisma.user.create({
            data: {
                email,
                proof,
                salt,
                id
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
        proof,
        { expiresIn: '7d' }
    );

    res.setHeader(
        'Set-Cookie',
        cookie.serialize('proof', proof, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production'
        })
    );

    res.setHeader(
        'Set-Cookie',
        cookie.serialize('_sn_session', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production'
        })
    );

    res.json(user);
};
