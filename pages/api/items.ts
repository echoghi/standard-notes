import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { validateRoute } from '../../lib/auth';
import { Note, User } from '../../types';

export default validateRoute(async function handle(req: NextApiRequest, res: NextApiResponse, user: User) {
    const { data } = <{ data: Note[] }>req.body;
    const userId = user.id;

    if (data) {
        // loop through data and update each field and push promise to an array then finish with promise.all
        const promises = [];
        for (const updatedNote of data) {
            const { id, userId: noteUser, ...note } = updatedNote;

            if (updatedNote.deleteFlag) {
                promises.push(
                    prisma.note.delete({
                        // @ts-ignore
                        where: { id }
                    })
                );
            } else {
                promises.push(
                    prisma.note.update({
                        // @ts-ignore
                        where: { id },
                        // @ts-ignore
                        data: {
                            ...note,
                            user: {
                                connect: {
                                    // @ts-ignore
                                    id: userId
                                }
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
});
