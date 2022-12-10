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
    updateNote: action((state: any, payload) => {
        if (payload.trashed) {
            state.activeNote = null;
            // filter out the note from the notes array
            state.notes = [...state.notes].filter((note: any) => note.id !== payload.id);
        } else {
            state.activeNote = payload;
            // Update note in notes array with the object passed in
            state.notes = [...state.notes]
                .map((note: any) => {
                    if (note.id === payload.id) {
                        return payload;
                    }
                    return note;
                })
                .sort((a: any, b: any) => {
                    if (a.pinned && !b.pinned) {
                        return -1;
                    }
                    if (!a.pinned && b.pinned) {
                        return 1;
                    }
                    return b.createdAt - a.createdAt;
                });
        }
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
