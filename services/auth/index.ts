import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

import prisma from '../db';

export const validateRoute =
  (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
    const { _sn_session: token, proof } = req.cookies;

    if (!proof || !token) return res.status(401).json({ error: 'Not Authorized' });

    if (token) {
      let user;

      try {
        const { id } = <{ id: string }>jwt.verify(token, proof);

        user = await prisma.user.findUnique({
          // @ts-ignore
          where: { id },
        });

        if (!user) {
          throw new Error('not real user');
        }
      } catch (e) {
        res.status(401).json({ error: 'Not Authorized' });
        return;
      }
      return handler(req, res, user);
    }
  };
