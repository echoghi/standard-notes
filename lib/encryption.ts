import { AES, enc } from 'crypto-js';

const secretKey = process.env.SECRET || 'secret';

// write a function that encrypts text using bcrypt and the secret key
export function encrypt(text: string) {
    const encryptedText = AES.encrypt(text, secretKey).toString();

    return encryptedText;
}

// write a function that decrypts text using bcrypt and the secret key
export function decrypt(text: string) {
    const bytes = AES.decrypt(text, secretKey);
    const decryptedText = bytes.toString(enc.Utf8);

    return decryptedText;
}
