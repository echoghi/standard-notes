import { createStore, action } from 'easy-peasy';
import { sortNotes } from './sort';

export const store = createStore({
    userId: null,
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
    secretKey: null,
    setKey: action((state: any, payload) => {
        state.secretKey = payload;
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

        if (payload.trashed) {
            state.deleted = [...state.deleted].filter((note: any) => note.id !== payload.id);
        } else {
            state.notes = [...state.notes].filter((note: any) => note.id !== payload.id);

            const newNotes = [...state.deleted, payload];

            state.deleted = sortNotes(newNotes, state.sortSetting);
        }
    }),
    createNote: action((state: any, payload) => {
        state.activeNote = payload;

        const newNotes = [...state.notes, payload];

        state.notes = sortNotes(newNotes, state.sortSetting);
    }),
    updateNote: action((state: any, payload) => {
        state.activeNote = payload;

        let updateNotes = [...state[`${state.view}`]];

        // Update note in notes array with the object passed in
        updateNotes = updateNotes.map((note: any) => {
            if (note.id === payload.id) {
                return payload;
            }
            return note;
        });

        state[`${state.view}`] = sortNotes(updateNotes, state.sortSetting);
    }),
    setLoading: action((state: any, payload) => {
        state.loading = payload;
        state.error = null;
    }),
    setActiveNote: action((state: any, payload) => {
        state.activeNote = payload;
    }),
    setUserId: action((state: any, payload) => {
        state.userId = payload;
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
