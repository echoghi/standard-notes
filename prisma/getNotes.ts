import prisma from '../services/db';
import { createSyncToken } from '../services';
import { sortNotes } from '../utils';

const getNotes = async (userId: string) => {
  if (!userId) {
    return {
      notes: [],
      starred: [],
      deleted: [],
      archived: [],
      starredCount: 0,
      deletedCount: 0,
      notesCount: 0,
      sortSetting: 'createdAt',
      error: 'No user id provided',
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      // @ts-ignore
      id: userId,
    },
  });

  // get all user notes
  const notes = await prisma.note.findMany({
    where: {
      AND: [
        {
          // @ts-ignore
          userId,
        },
        {
          // @ts-ignore
          archived: false,
        },
        {
          // @ts-ignore
          deleted: false,
        },
      ],
    },
    orderBy: {
      // @ts-ignore
      pinned: 'desc',
    },
  });

  // get all user starred notes
  const starred = await prisma.note.findMany({
    where: {
      AND: [
        {
          // @ts-ignore
          userId,
        },
        {
          // @ts-ignore
          starred: true,
        },
        {
          // @ts-ignore
          archived: false,
        },
        {
          // @ts-ignore
          deleted: false,
        },
      ],
    },
  });

  // get all user deleted notes
  const deleted = await prisma.note.findMany({
    where: {
      AND: [
        {
          // @ts-ignore
          userId,
        },
        {
          // @ts-ignore
          deleted: true,
        },
      ],
    },
  });

  // get all user archived notes
  const archived = await prisma.note.findMany({
    where: {
      AND: [
        {
          // @ts-ignore
          userId,
        },
        {
          // @ts-ignore
          archived: true,
        },
        {
          // @ts-ignore
          deleted: false,
        },
      ],
    },
  });

  const syncToken = createSyncToken();

  return {
    notes: sortNotes(notes, 'createdAt'),
    starred: sortNotes(starred, 'createdAt'),
    deleted: sortNotes(deleted, 'createdAt'),
    archived: sortNotes(archived, 'createdAt'),
    starredCount: starred?.length,
    deletedCount: deleted?.length,
    notesCount: notes?.length,
    user,
    syncToken,
  };
};

export default getNotes;
