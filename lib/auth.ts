import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from './prisma';

export const validateRoute = (handler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const { _sn_session: token, proof } = req.cookies;

        if (token) {
            let user;

            try {
                const { id } = jwt.verify(token, proof);

                user = await prisma.user.findUnique({
                    where: { id }
                });

                if (!user) {
                    throw new Error('not real user');
                }
            } catch (e) {
                res.status(401);
                res.json({ error: 'Not Authorized' });
                return;
            }
            return handler(req, res, user);
        }

        res.status(401);
        res.json({ error: 'Not Authorized' });
    };
};
