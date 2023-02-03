import { Note } from '../../types';
import { fetcher } from '../../utils';

export const auth = (
  mode: 'signin' | 'signup',
  body: { id: string; email: string; proof: string; salt: string },
) => fetcher(`/${mode}`, body);

export const logOut = () => fetcher('/logout');

export const matchUser = (body: { email: string }) => fetcher('/matchUser', body);

export const saveBulkNotes = (body: { syncToken: string; items?: Note[] }) => fetcher('/items', { ...body, items: body.items || [] });

export const updateUserSettings = (data: { sort?: string; theme?: string }) => fetcher('/user', { data });
