import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

import { validateRoute } from '../../services/auth';

export default validateRoute(async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Set-Cookie', [
    cookie.serialize('_sn_session', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    }),
    cookie.serialize('proof', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    }),
  ]);

  res.status(307).json({ message: 'Logged out' });
});
