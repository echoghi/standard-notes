import { Note } from '../types';
import { decrypt, encrypt } from './encryption';

export function setLocalStorage(name: string, value: string): void {
    try {
        // Set the local storage with the given name
        localStorage.setItem(name, value);
    } catch (e) {
        throw new Error('Unable to set local storage');
    }
}

export function getLocalStorage(name: string): string | null {
    try {
        // Get the local storage with the given name
        return localStorage.getItem(name);
    } catch (e) {
        throw new Error('Unable to get local storage');
    }
}

export function storeEncryptedNotes(note: Note): void {
    const storedNotes = JSON.parse(decrypt(getLocalStorage('enc_notes')));

    if (!storedNotes) {
        setLocalStorage('enc_notes', encrypt(JSON.stringify([note])));
        return;
    }

    // remove the note if it already exists in the array
    const filtered = storedNotes.filter((n: Note) => n.id !== note.id);

    // replace with most recent change
    filtered.push(note);

    // Encrypt the notes
    const encryptedNotes = encrypt(JSON.stringify(filtered));
    // Store the encrypted notes
    setLocalStorage('enc_notes', encryptedNotes);
}
