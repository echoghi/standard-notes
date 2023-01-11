import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { validateRoute } from '../../lib/auth';
import { Note, User } from '../../types';

export default validateRoute(async function handle(req: NextApiRequest, res: NextApiResponse, user: User) {
    const { items, syncToken } = <{ items: Note[]; syncToken: string }>req.body;
    const userId = user.id;

    // decrypt the base64 encoded syncToken
    const decodedSyncToken = +atob(syncToken);

    const lastSync = new Date(decodedSyncToken).toISOString();

    // query the note table for any notes that were updated after the syncToken
    const retrievedItems = await prisma.note.findMany({
        where: {
            updatedAt: {
                gte: lastSync
            },
            userId
        }
    });

    const date = String(Date.now());
    const newSyncToken = btoa(date);

    type Items = any;

    let savedItems: Items = [];
    const conflicts: Items = [];

    let message = 'success';
    let updatedUser: any = null;

    if (items.length) {
        const promises = [];
        for (const updatedNote of items) {
            const { id, userId: noteUser, createFlag, deleteFlag, ...note } = updatedNote;

            if (deleteFlag) {
                promises.push(
                    prisma.note.delete({
                        // @ts-ignore
                        where: { id }
                    })
                );
            } else if (createFlag) {
                promises.push(
                    prisma.note.create({
                        data: {
                            // @ts-ignore
                            ...note,
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
                            updatedAt: new Date(),
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

        savedItems = await prisma.$transaction(promises);
        message = 'changes saved';
    }

    updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            // @ts-ignore
            updatedAt: new Date()
        }
    });

    res.status(200).json({
        message,
        meta: { auth: { userId: updatedUser.id, updatedAt: updatedUser.updatedAt } },
        data: { savedItems, retrievedItems, conflicts, syncToken: newSyncToken }
    });
});
