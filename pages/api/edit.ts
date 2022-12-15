import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { validateRoute } from '../../lib/auth';
import { User } from '../../types';

export default validateRoute(async function handle(req: NextApiRequest, res: NextApiResponse, user: User) {
    const { id, title, content } = req.body;
    const userId = user.id;

    // check if note exists
    const noteExists = await prisma.note.findUnique({
        where: { id }
    });

    let newNote;

    if (noteExists) {
        newNote = await prisma.note.update({
            where: { id },
            data: {
                // @ts-ignore
                title,
                content,
                updatedAt: new Date(),
                user: {
                    connect: {
                        // @ts-ignore
                        id: userId
                    }
                }
            }
        });
    } else {
        newNote = await prisma.note.create({
            data: {
                // @ts-ignore
                title,
                content,
                id,
                createdAt: new Date(),
                updatedAt: new Date(),
                user: {
                    connect: {
                        // @ts-ignore
                        id: userId
                    }
                }
            }
        });
    }

    await prisma.user.update({
        // @ts-ignore
        where: { id: userId },
        data: {
            // @ts-ignore
            updatedAt: new Date()
        }
    });

    res.json(newNote);
});
