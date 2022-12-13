import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Set-Cookie', [
        cookie.serialize('_sn_session', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/',
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production'
        }),
        cookie.serialize('proof', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/',
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production'
        })
    ]);

    res.status(307).json({ message: 'Logged out' });
};
