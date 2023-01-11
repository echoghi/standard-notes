import { Note } from '../types';
import fetcher from './fetcher';

export const auth = (mode: 'signin' | 'signup', body: { id: string; email: string; proof: string; salt: string }) => {
    return fetcher(`/${mode}`, body);
};

export const logOut = () => {
    return fetcher('/logout');
};

export const matchUser = (body: { email: string }) => {
    return fetcher('/matchUser', body);
};

export const saveBulkNotes = (body: { syncToken: string; items?: Note[] }) => {
    return fetcher('/items', { ...body, items: body.items || [] });
};

export const updateUserSettings = (data: { sort?: string; theme?: string }) => {
    return fetcher('/user', { data });
};
