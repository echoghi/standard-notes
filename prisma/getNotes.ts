import prisma from '../lib/prisma';

const getNotes = async (userId: string) => {
    if (!userId) throw new Error('No user id provided');

    // get all user notes
    const notes = await prisma.note.findMany({
        where: {
            AND: [
                {
                    userId: Number(userId)
                },
                {
                    deleted: false
                }
            ]
        },
        orderBy: {
            pinned: 'desc'
        }
    });

    // get all user starred notes
    const starred = await prisma.note.findMany({
        where: {
            AND: [
                {
                    userId: Number(userId)
                },
                {
                    starred: true
                },
                {
                    deleted: false
                }
            ]
        }
    });

    // get all user deleted notes
    const deleted = await prisma.note.findMany({
        where: {
            AND: [
                {
                    userId: Number(userId)
                },
                {
                    deleted: true
                }
            ]
        }
    });

    // get Number of deleted notes
    const deletedCount = deleted.length;

    // get Number of  notes
    const notesCount = notes.length;

    // get number of starred notes
    const starredCount = starred.length;

    return {
        notes,
        starred,
        deleted,
        starredCount,
        deletedCount,
        notesCount
    };
};

export default getNotes;
