import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { data } = req.body;
    const { proof, _sn_session } = req.cookies;

    const { id: userId } = jwt.verify(_sn_session, proof);

    if (data) {
        // loop through data and update each field and push promise to an array then finish with promise.all
        const promises = [];
        for (const updatedNote of Object.entries(data)) {
            const { id } = updatedNote;

            if (updatedNote.deleteFlag) {
                promises.push(
                    prisma.note.delete({
                        where: { id },
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    })
                );
                continue;
            } else {
                promises.push(
                    prisma.note.update({
                        where: { id },
                        data: {
                            ...updatedNote
                        },
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    })
                );
            }
        }
        await Promise.all(promises);

        res.status(200).json({ message: 'Changes saved' });
    } else {
        res.status(200).json({ message: 'success' });
    }
}
