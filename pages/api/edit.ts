import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

// write a next js api route to update a note
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id, title, content } = req.body;

    let result;

    if (id) {
        result = await prisma.note.update({
            where: { id: Number(id) },
            data: { title, content, updatedAt: new Date() }
        });
    } else {
        result = await prisma.note.create({
            data: { title, content, createdAt: new Date(), updatedAt: new Date() }
        });
    }

    res.json(result);
}
