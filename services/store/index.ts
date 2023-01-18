import { createStore, action } from 'easy-peasy';
import { Note, Theme, User } from 'types';
import { isFullLayout, sortNotes } from 'utils';

export const store = createStore({
    notes: [],
    starred: [],
    deleted: [],
    archived: [],
    starredCount: 0,
    deletedCount: 0,
    notesCount: 0,
    user: null,
    theme: 'light',
    view: 'notes',
    sortSetting: 'createdAt',
    activeNote: null,
    loading: false,
    error: null,
    synced: true,
    syncToken: null,
    focusMode: false,
    tagsPanel: isFullLayout(),
    notesPanel: true,
    updateUser: action((state: any, payload) => {
        state.user = { ...state.user, ...payload };
    }),
    setSyncToken: action((state: any, payload: string) => {
        state.syncToken = payload;
    }),
    toggleFocusMode: action((state: any) => {
        state.focusMode = !state.focusMode;
    }),
    toggleTagsPanel: action((state: any) => {
        state.tagsPanel = !state.tagsPanel;
    }),
    toggleNotesPanel: action((state: any) => {
        state.notesPanel = !state.notesPanel;
    }),
    setTagsPanel: action((state: any, payload: boolean) => {
        state.tagsPanel = payload;
    }),
    setNotesPanel: action((state: any, payload: boolean) => {
        state.notesPanel = payload;
    }),
    setSynced: action((state: any, payload: boolean) => {
        state.synced = payload;
    }),
    setSort: action((state: any, payload: string) => {
        state.sortSetting = payload;

        state.notes = sortNotes([...state.notes], payload);
        state.starred = sortNotes([...state.starred], payload);
        state.deleted = sortNotes([...state.deleted], payload);
        state.archived = sortNotes([...state.archived], payload);
    }),
    setView: action((state: any, payload: string) => {
        state.view = payload;
    }),
    setError: action((state: any, payload) => {
        state.error = payload;
    }),
    setLoading: action((state: any, payload: boolean) => {
        state.loading = payload;
    }),
    deleteNote: action((state: any, payload: Note) => {
        state.activeNote = null;
        const isStarred = payload.starred;
        payload.updatedAt = new Date().toISOString();

        if (state.view === 'deleted') {
            const updatedNotes = [...state.deleted].filter((note: any) => note.id !== payload.id);

            state.deleted = updatedNotes;
            state.deletedCount = updatedNotes.length;
        } else {
            const updatedNotes = [...state.notes].filter((note: any) => note.id !== payload.id);
            const updatedStarred = isStarred
                ? [...state.starred].filter((note: any) => note.id !== payload.id)
                : [...state.starred];
            const updatedDeleted = [...state.deleted, payload];

            state.notes = updatedNotes;
            state.notesCount = updatedNotes.length;
            state.starred = updatedStarred;
            state.starredCount = updatedStarred.length;
            state.deletedCount = updatedDeleted.length;
            state.deleted = sortNotes(updatedDeleted, state.sortSetting);
        }
    }),
    emptyTrash: action((state: any) => {
        state.deleted = [];

        state.deletedCount = 0;
        state.activeNote = null;
    }),
    createNote: action((state: any, payload: Note) => {
        // remove db flag
        delete payload.createFlag;

        state.activeNote = payload;

        const newNotes = [...state.notes, payload];
        const newCount = newNotes.length;

        state.notesCount = newCount;
        state.notes = sortNotes(newNotes, state.sortSetting);
    }),
    restoreNote: action((state: any, payload: Note) => {
        payload.updatedAt = new Date().toISOString();
        state.activeNote = payload;
        state.view = 'notes';

        // remove from deleted
        const updatedDeleted = [...state.deleted].filter((note: any) => note.id !== payload.id);

        const updatedNotes = [...state.notes, payload];

        let updatedStarred = [...state.starred];

        if (payload.starred) updatedStarred = [...state.starred, payload];

        state.deletedCount = updatedDeleted.length;
        state.notesCount = updatedNotes.length;
        state.starredCount = updatedStarred.length;

        state.starred = updatedStarred;
        state.deleted = updatedDeleted;
        state.notes = sortNotes(updatedNotes, state.sortSetting);
    }),
    updateNote: action((state: any, payload: Note) => {
        payload.updatedAt = new Date().toISOString();
        state.activeNote = payload;

        let updatedNotes = [...state[`${state.view}`]];

        // Update note in notes array with the object passed in
        updatedNotes = updatedNotes.map((note: any) => {
            if (note.id === payload.id) {
                return payload;
            }
            return note;
        });

        state[`${state.view}`] = sortNotes(updatedNotes, state.sortSetting);
    }),
    updateStarred: action((state: any, payload: Note) => {
        payload.updatedAt = new Date().toISOString();
        state.activeNote = payload;
        let updatedStarred = [...state.starred];
        let updatedNotes = [...state.notes];

        if (payload.starred) {
            // check if note is already in starred
            const noteExists = updatedStarred.find((note: any) => note.id === payload.id);
            updatedStarred = !noteExists ? [...state.starred, payload] : updatedStarred;
        } else {
            updatedStarred = [...state.starred].filter((note: any) => note.id !== payload.id);
        }

        updatedNotes = updatedNotes.map((note: any) => {
            if (note.id === payload.id) {
                return payload;
            }
            return note;
        });

        state.notes = sortNotes(updatedNotes, state.sortSetting);
        state.starred = sortNotes(updatedStarred, state.sortSetting);
        state.starredCount = updatedStarred.length;
    }),
    updateArchived: action((state: any, payload: Note) => {
        payload.updatedAt = new Date().toISOString();
        state.activeNote = null;
        let updatedArchived = [...state.archived];
        let updatedNotes = [...state.notes];
        let updatedStarred = [...state.starred];

        if (payload.archived) {
            updatedArchived = [...state.archived, payload];
            updatedNotes = updatedNotes.filter((note: any) => note.id !== payload.id);
            updatedStarred = updatedStarred.filter((note: any) => note.id !== payload.id);
        } else {
            updatedArchived = [...state.archived].filter((note: any) => note.id !== payload.id);

            if (payload.starred) {
                updatedStarred = [...state.starred, payload];
            }

            updatedNotes = [...state.notes, payload];
        }

        state.notes = sortNotes(updatedNotes, state.sortSetting);
        state.starred = sortNotes(updatedStarred, state.sortSetting);
        state.archived = sortNotes(updatedArchived, state.sortSetting);
        state.notesCount = updatedNotes.length;
        state.starredCount = updatedStarred.length;
    }),
    setActiveNote: action((state: any, payload: Note) => {
        state.activeNote = payload;
    }),
    syncNotes: action((state: any, payload: Note[]) => {
        for (const note of payload) {
            if (note.id === state.activeNote?.id) {
                state.activeNote = note;
            }

            const noteIndex = state.notes.findIndex((n: any) => n.id === note.id);
            const starredIndex = state.starred.findIndex((n: any) => n.id === note.id);
            const archivedIndex = state.archived.findIndex((n: any) => n.id === note.id);
            const deletedIndex = state.deleted.findIndex((n: any) => n.id === note.id);

            if (!note.deleted && !note.archived) {
                if (noteIndex === -1) {
                    const updatedNotes = [...state.notes, note];

                    state.notes = sortNotes(updatedNotes, state.sortSetting);
                    state.notesCount += 1;
                } else if (new Date(note.updatedAt) > new Date(state.notes[noteIndex].updatedAt)) {
                    state.notes[noteIndex] = note;
                }
            } else if (noteIndex !== -1) {
                const updatedNotes = [...state.notes].filter((n: any) => n.id !== note.id);
                state.notes = sortNotes(updatedNotes, state.sortSetting);
                state.notesCount -= 1;
            }

            if (note.starred && !note.archived) {
                if (starredIndex === -1) {
                    const updatedStarred = [...state.starred, note];

                    state.starred = sortNotes(updatedStarred, state.sortSetting);
                    state.starredCount += 1;
                } else if (new Date(note.updatedAt) > new Date(state.starred[noteIndex].updatedAt)) {
                    state.starred[noteIndex] = note;
                }
            } else if (starredIndex !== -1) {
                const updatedStarred = [...state.starred].filter((n: any) => n.id !== note.id);
                state.starred = sortNotes(updatedStarred, state.sortSetting);
                state.starredCount -= 1;
            }

            if (note.archived) {
                if (archivedIndex === -1) {
                    const updatedArchived = [...state.archived, note];

                    state.archived = sortNotes(updatedArchived, state.sortSetting);
                } else if (new Date(note.updatedAt) > new Date(state.archived[noteIndex].updatedAt)) {
                    state.archived[noteIndex] = note;
                }
            } else if (archivedIndex !== -1) {
                const updatedArchived = [...state.archived].filter((n: any) => n.id !== note.id);
                state.archived = sortNotes(updatedArchived, state.sortSetting);
            }

            if (note.deleted) {
                if (deletedIndex === -1) {
                    const updatedDeleted = [...state.deleted, note];

                    state.deleted = sortNotes(updatedDeleted, state.sortSetting);
                    state.deletedCount += 1;
                } else if (new Date(note.updatedAt) > new Date(state.deleted[noteIndex].updatedAt)) {
                    state.deleted[noteIndex] = note;
                }
            } else if (deletedIndex !== -1) {
                const updatedDeleted = [...state.deleted].filter((n: any) => n.id !== note.id);
                state.deleted = sortNotes(updatedDeleted, state.sortSetting);
                state.deletedCount -= 1;
            }
        }
    }),
    setNotes: action(
        (
            state: any,
            payload: {
                deleted: Note[];
                starred: Note[];
                archived: Note[];
                notes: Note[];
                starredCount: number;
                deletedCount: number;
                notesCount: number;
                newNote: Note;
                user: User;
                sortSetting: string;
                theme: Theme;
                syncToken: string;
            }
        ) => {
            state.loading = false;
            state.deleted = payload?.deleted;
            state.starred = payload?.starred;
            state.archived = payload?.archived;
            state.notes = payload?.notes;
            state.deletedCount = payload?.deletedCount;
            state.starredCount = payload?.starredCount;
            state.notesCount = payload?.notesCount;
            state.activeNote = payload.newNote;
            state.user = payload.user;
            state.sortSetting = payload.user.sort;
            state.theme = payload.user.theme;
            state.syncToken = payload.syncToken;
        }
    )
});
