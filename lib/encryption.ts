import { AES, PBKDF2, enc, lib, HmacSHA256 } from 'crypto-js';
import { Note } from '../types';
import { getLocalStorage, setLocalStorage } from './storage';

export function encrypt(text: string | null) {
    if (!text) return '';
    const secretKey = getLocalStorage('pk');

    if (!secretKey) {
        console.log('user is not logged in, bypassing encryption');
        return text;
    }
    const encryptedText = AES.encrypt(text, secretKey).toString();

    return encryptedText;
}

export function decrypt(text: string | null) {
    if (!text) return '';
    const secretKey = getLocalStorage('pk');

    if (!secretKey) {
        console.log('user is not logged in, bypassing decryption');
        return text;
    }
    const bytes = AES.decrypt(text, secretKey);
    const decryptedText = bytes.toString(enc.Utf8);

    return decryptedText;
}

function generateSalt() {
    // Generate a random salt
    const salt = lib.WordArray.random(16);

    // Return the salt as a hexadecimal string
    return salt.toString();
}

export function generateUuid() {
    if (!window.crypto) throw new Error('window.crypto is not available');

    return crypto.randomUUID();
}

export function generateProof(secretKey: string) {
    const signedProof = HmacSHA256('proof', secretKey).toString();

    return signedProof;
}

export function encryptPassword(password: string, existingSalt?: string) {
    const salt = existingSalt || generateSalt(); // The salt should be a random string of at least 16 characters

    const iterations = 100;
    const keySize = 32;

    // Create a PBKDF2 hash of the password using the specified options
    const hash = PBKDF2(password, salt, { iterations, keySize });
    const key = hash.toString();

    // generate a proof with the key
    const proof = generateProof(key);

    return { proof, salt, password: key };
}

export function markNotesForDeletion(notes: Note[]): void {
    const storedNotes = JSON.parse(decrypt(getLocalStorage('enc_notes')) || '[]');

    // if a note was both created and deleted while offline remove it from the array
    const allNotes = storedNotes.concat(notes).filter((n: Note) => !n.createFlag);

    // Encrypt the notes
    const encryptedNotes = encrypt(JSON.stringify(allNotes));

    // Store the encrypted notes
    setLocalStorage('enc_notes', encryptedNotes);
}

export function storeEncryptedNotes(note: Note): void {
    const storedNotes = JSON.parse(decrypt(getLocalStorage('enc_notes')) || '[]');

    if (!storedNotes || !storedNotes.length) {
        setLocalStorage('enc_notes', encrypt(JSON.stringify([note])));
        return;
    }

    let noteExists = false;

    // merge the old note with the new one
    for (let n of storedNotes) {
        if (n.id === note.id) {
            noteExists = true;
            n = {
                ...n,
                ...note
            };
        }
    }

    if (!noteExists) {
        storedNotes.push(note);
    }

    // Encrypt the notes
    const encryptedNotes = encrypt(JSON.stringify(storedNotes));
    // Store the encrypted notes
    setLocalStorage('enc_notes', encryptedNotes);
}

export function getEncryptedNotes(): Note[] | boolean {
    const storedNotes = JSON.parse(decrypt(getLocalStorage('enc_notes')) || '[]');

    if (!storedNotes || !storedNotes.length) {
        return false;
    }

    return storedNotes;
}

export function clearStoredNotes(): void {
    setLocalStorage('enc_notes', '');
}

export function createSyncToken(): string {
    const timestamp = Date.now();

    // Base64-encode the date
    return btoa(String(timestamp));
}
