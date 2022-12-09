import { createStore, action } from 'easy-peasy';

export const store = createStore({
    userId: null,
    notes: [],
    starred: [],
    deleted: [],
    starredCount: 0,
    deletedCount: 0,
    notesCount: 0,
    view: 'notes',
    activeNote: null,
    loading: false,
    error: null,
    setView: action((state: any, payload) => {
        state.view = payload;
    }),
    setError: action((state: any, payload) => {
        state.error = payload;
        state.loading = false;
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
