import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../services/db';
import { validateRoute } from '../../services/auth';
import { User } from '../../types';

export default validateRoute(async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User,
) => {
  const { data } = req.body;
  const userId = user.id;

  await prisma.user.update({
    // @ts-ignore
    where: { id: userId },
    data: {
      // @ts-ignore
      ...data,
    },
  });

  res.json({ message: 'success' });
});
