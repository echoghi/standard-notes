import { Note } from '../types';
import fetcher from './fetcher';

export const auth = (mode: 'signin' | 'signup', body: { email: string; password: string }) => {
    return fetcher(`/${mode}`, body);
};

export const logOut = () => {
    return fetcher('/logout');
};

export const update = (body: { id: string; data: any }) => {
    return fetcher('/update', body);
};

export const remove = (body: { id: string; trashed: boolean }) => {
    return fetcher('/delete', body);
};

export const clearTrash = () => {
    return fetcher('/emptyTrash');
};

export const duplicate = (body: { id: string; newId: string }) => {
    return fetcher('/duplicate', body);
};

export const matchUser = (body: { email: string }) => {
    return fetcher('/matchUser', body);
};

export const edit = (newNote: Note) => {
    return fetcher('/edit', newNote);
};

export const saveBulkNotes = (notes?: Note[]) => {
    return fetcher('/items', notes);
};
