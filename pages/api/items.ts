import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../services/db';
import { validateRoute } from '../../services/auth';
import { Note, User } from '../../types';

export default validateRoute(async function handle(req: NextApiRequest, res: NextApiResponse, user: User) {
    const { items, syncToken } = <{ items: Note[]; syncToken: string }>req.body;
    const userId = user.id;

    // decrypt the base64 encoded syncToken
    const decodedSyncToken = +atob(syncToken);

    const lastSync = new Date(decodedSyncToken).toISOString();

    type Items = any;

    let savedItems: Items = [];
    const conflicts: Items = [];

    let message = 'success';
    let updatedUser: any = null;

    // Create a set to keep track of the ids of the items that were just changed by the API
    const changedItemsIds = new Set<string>();

    if (items.length) {
        const promises = [];
        for (const updatedNote of items) {
            const { id, userId: noteUser, createFlag, deleteFlag, ...note } = updatedNote;

            const updatedAt = new Date();
            changedItemsIds.add(id);

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
                            createdAt: updatedAt,
                            updatedAt,
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
                            updatedAt,
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

    // query the note table for any notes that were updated after the syncToken
    const rawRetrievedItems = await prisma.note.findMany({
        where: {
            updatedAt: {
                gte: lastSync
            },
            userId
        }
    });

    // Filter the retrieved items to exclude those that were just changed by the API
    const retrievedItems = rawRetrievedItems.filter((item) => !changedItemsIds.has(item.id));

    const timestamp = String(Date.now());
    const newSyncToken = btoa(timestamp);

    res.status(200).json({
        message,
        meta: { auth: { userId: updatedUser.id, updatedAt: updatedUser.updatedAt } },
        data: { savedItems, retrievedItems, conflicts, syncToken: newSyncToken }
    });
});
