import { createStore, action } from 'easy-peasy';

export const store = createStore({
    notes: [],
    activeNote: null,
    setActiveNote: action((state: any, payload) => {
        state.activeNote = payload;
    }),
    setNotes: action((state: any, payload) => {
        state.notes = payload;
    })
});
