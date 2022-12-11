import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, title, content } = req.body;
    const { userId } = req.cookies;

    let newNote;

    if (id) {
        newNote = await prisma.note.update({
            where: { id: Number(id) },
            data: {
                title,
                content,
                updatedAt: new Date(),
                user: {
                    connect: {
                        id: Number(userId)
                    }
                }
            }
        });
    } else {
        newNote = await prisma.note.create({
            data: {
                title,
                content,
                createdAt: new Date(),
                updatedAt: new Date(),
                user: {
                    connect: {
                        id: Number(userId)
                    }
                }
            }
        });
    }

    res.json(newNote);
}
