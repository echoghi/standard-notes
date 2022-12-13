import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import prisma from '../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, title, content } = req.body;
    const { proof, _sn_session } = req.cookies;

    const { id: userId } = jwt.verify(_sn_session, proof);

    // check if note exists
    const noteExists = await prisma.note.findUnique({
        where: { id }
    });

    let newNote;

    if (noteExists) {
        newNote = await prisma.note.update({
            where: { id },
            data: {
                title,
                content,
                updatedAt: new Date(),
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    } else {
        newNote = await prisma.note.create({
            data: {
                title,
                content,
                id,
                createdAt: new Date(),
                updatedAt: new Date(),
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    }

    res.json(newNote);
}
