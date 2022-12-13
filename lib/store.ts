import { createStore, action } from 'easy-peasy';
import { sortNotes } from './sort';

export const store = createStore({
    notes: [],
    starred: [],
    deleted: [],
    starredCount: 0,
    deletedCount: 0,
    notesCount: 0,
    view: 'notes',
    sortSetting: 'createdAt',
    activeNote: null,
    loading: false,
    error: null,
    setSort: action((state: any, payload) => {
        state.sortSetting = payload;

        state.notes = sortNotes([...state.notes], payload);
        state.starred = sortNotes([...state.starred], payload);
        state.deleted = sortNotes([...state.deleted], payload);
    }),
    setView: action((state: any, payload) => {
        state.view = payload;
    }),
    setError: action((state: any, payload) => {
        state.error = payload;
        state.loading = false;
    }),
    deleteNote: action((state: any, payload) => {
        state.activeNote = null;
        const isStarred = payload.starred;

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
    emptyTrash: action((state: any, payload) => {
        state.deleted = [];

        state.deletedCount = 0;
        state.activeNote = null;
    }),
    createNote: action((state: any, payload) => {
        state.activeNote = payload;

        const newNotes = [...state.notes, payload];
        const newCount = newNotes.length;

        state.notesCount = newCount;
        state.notes = sortNotes(newNotes, state.sortSetting);
    }),
    restoreNote: action((state: any, payload) => {
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
    updateNote: action((state: any, payload) => {
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
    updateStarred: action((state: any, payload) => {
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
    setLoading: action((state: any, payload) => {
        state.loading = payload;
        state.error = null;
    }),
    setActiveNote: action((state: any, payload) => {
        state.activeNote = payload;
    }),
    setNotes: action((state: any, payload) => {
        state.loading = false;
        state.deleted = payload?.deleted;
        state.starred = payload?.starred;
        state.notes = payload?.notes;
        state.deletedCount = payload?.deletedCount;
        state.starredCount = payload?.starredCount;
        state.notesCount = payload?.notesCount;
        state.activeNote = payload.newNote;
    })
});
