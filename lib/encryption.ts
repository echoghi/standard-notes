import { AES, PBKDF2, enc, lib, HmacSHA256 } from 'crypto-js';
import { getLocalStorage } from './storage';

// write a function that encrypts text using bcrypt and the secret key
export function encrypt(text: string) {
    const secretKey = getLocalStorage('synctoken');

    if (!secretKey) {
        console.log('user is not logged in, bypassing encryption');
        return text;
    }
    const encryptedText = AES.encrypt(text, secretKey).toString();

    return encryptedText;
}

// write a function that decrypts text using bcrypt and the secret key
export function decrypt(text: string) {
    const secretKey = getLocalStorage('synctoken');

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

export function encryptPassword(password: string, existingSalt?: string) {
    const salt = existingSalt || generateSalt(); // The salt should be a random string of at least 16 characters

    const iterations = 100000; // The number of iterations should be at least 100000 for good security
    const keySize = 32; // The length of the derived key should be at least 32 bytes

    // Create a PBKDF2 hash of the password using the specified options
    const hash = PBKDF2(password, salt, { iterations, keySize });
    const key = hash.toString();

    // generate a proof with the key
    const proof = generateProof(key);

    return { proof, salt, password: key };
}

export function generateProof(secretKey: string) {
    const signedProof = HmacSHA256('proof', secretKey).toString();

    return signedProof;
}
