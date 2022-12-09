import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import getNotes from '../../prisma/getNotes';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, title, content } = req.body;

    let newNote;

    if (id) {
        newNote = await prisma.note.update({
            where: { id: Number(id) },
            data: { title, content, updatedAt: new Date() }
        });
    } else {
        newNote = await prisma.note.create({
            data: { title, content, createdAt: new Date(), updatedAt: new Date() }
        });
    }

    const response = await getNotes();

    res.json({
        newNote,
        ...response
    });
}
