import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

import { validateRoute } from '../../services/auth';

const isProduction = process.env.NODE_ENV === 'production';

export default validateRoute(async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Set-Cookie', [
    cookie.serialize('_sn_session', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
      sameSite: 'strict',
      secure: isProduction,
    }),
    cookie.serialize('proof', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
      sameSite: 'strict',
      secure: isProduction,
    }),
  ]);

  res.status(307).json({ message: 'Logged out' });
});
