import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import getNotes from '../../prisma/getNotes';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { title, content } = req.body;
    const newNote = await prisma.note.create({
        data: { title, content, createdAt: new Date(), updatedAt: new Date() }
    });

    const response = await getNotes();

    res.json({
        newNote,
        ...response
    });
}
