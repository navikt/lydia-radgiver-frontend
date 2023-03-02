import { randomBytes, createHash, createCipheriv, createDecipheriv } from "crypto";

const ALGORITHM = "aes-256-gcm"; // AES-256
const HASH_ALGORITHM = "sha256";

export async function encrypt(secret: string) {
    const sha256 = createHash(HASH_ALGORITHM);
    sha256.update(process.env.OBO_TOKEN_ENC_KEY);
    const iv = randomBytes(16);
    const cipher = createCipheriv(ALGORITHM, sha256.digest(), iv);
    const cipherText = cipher.update(Buffer.from(secret));
    const enc = cipher.final()
    const encrypted = Buffer.concat([iv, cipher.getAuthTag(), cipherText, enc]);
    return encrypted.toString("base64");
}

export async function decrypt(encrypted: string) {
    const sha256 = createHash(HASH_ALGORITHM);
    sha256.update(process.env.OBO_TOKEN_ENC_KEY);
    const input = Buffer.from(encrypted, "base64");
    const iv = input.slice(0, 16);
    const authTag = input.slice(16, 32)
    const decipher = createDecipheriv(ALGORITHM, sha256.digest(), iv);
    decipher.setAuthTag(authTag)
    const cipherText = input.slice(32);
    const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);
    return decrypted.toString();
}

