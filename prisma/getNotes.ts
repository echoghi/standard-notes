import prisma from '../lib/prisma';

const getNotes = async () => {
    const notes = await prisma.note.findMany({
        where: {
            deleted: false
        },
        orderBy: {
            pinned: 'desc'
        }
    });

    // get all starred notes
    const starred = await prisma.note.findMany({
        where: {
            starred: true,
            deleted: false
        }
    });

    const deleted = await prisma.note.findMany({
        where: {
            deleted: true
        }
    });

    // get Number of deleted notes
    const deletedCount = await prisma.note.count({
        where: {
            deleted: true
        }
    });

    // get Number of  notes
    const notesCount = await prisma.note.count({
        where: {
            deleted: false
        }
    });

    // get number of starred notes
    const starredCount = await prisma.note.count({
        where: {
            starred: true,
            deleted: false
        }
    });

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
