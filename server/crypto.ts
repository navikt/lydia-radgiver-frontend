import {
    randomBytes,
    createHash,
    createCipheriv,
    createDecipheriv,
} from "crypto";
import {
    decryptionFailureAllKeysTriedCounter,
    secondaryKeyDecryptionSuccessCounter,
} from "./metrikker";

const ALGORITHM = "aes-256-gcm"; // AES-256
const HASH_ALGORITHM = "sha256";
const IV_LENGTH = 16; // initialiseringsvektor lengde
const AUTH_TAG_LENGTH = 16; // autentiseringstagg

/* Validerer nøklene og skiller aktiv skrivenøkkel fra nøklene vi kan lese med.
   Returnerer et objekt med den aktive nøkkelen og en liste over lesbare nøkler. */
export function validateEncryptionKeys() {
    const active = process.env.OBO_TOKEN_ENC_KEY;
    if (!active?.trim()) {
        throw new Error("OBO_TOKEN_ENC_KEY må være satt");
    }

    // PREVIOUS leser gamle økter etter nøkkelbyttet; NEXT lar eldre pod-er lese nye økter.
    // Begge trengs mens pod-er med ulik aktiv nøkkel kjører samtidig.
    const secondary = [
        process.env.OBO_TOKEN_ENC_KEY_PREVIOUS,
        process.env.OBO_TOKEN_ENC_KEY_NEXT,
    ];
    if (secondary.some((key) => key !== undefined && !key.trim())) {
        throw new Error("Overgangsnøkler for OBO-token kan ikke være tomme");
    }

    return {
        active,
        readable: [
            active,
            ...secondary.filter((key): key is string => key !== undefined),
        ].filter((key, index, keys) => keys.indexOf(key) === index),
    };
}

// Beholder samme SHA-256-avledning (algoritme) som eldre krypterte økter bruker.
function deriveKey(secret: string) {
    return createHash(HASH_ALGORITHM).update(secret).digest();
}

// Krypterer med aktiv nøkkel fra validateEncryptionKeys og lagrer IV, tagg og ciphertext.
export async function encrypt(secret: string) {
    const { active } = validateEncryptionKeys();
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, deriveKey(active), iv);
    const cipherText = cipher.update(Buffer.from(secret));
    const enc = cipher.final();
    const encrypted = Buffer.concat([iv, cipher.getAuthTag(), cipherText, enc]);
    return encrypted.toString("base64");
}

// Prøver lesekøen fra validateEncryptionKeys; returnerer bare tekst etter godkjent AES-GCM-tagg.
export async function decrypt(encrypted: string) {
    const { readable } = validateEncryptionKeys();
    const input = Buffer.from(encrypted, "base64");
    if (input.length < IV_LENGTH + AUTH_TAG_LENGTH) {
        throw new Error("Ugyldig kryptert OBO-token");
    }
    const iv = input.subarray(0, IV_LENGTH);
    const authTag = input.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const cipherText = input.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    for (const [index, key] of readable.entries()) {
        const decipher = createDecipheriv(ALGORITHM, deriveKey(key), iv);
        decipher.setAuthTag(authTag);
        const plaintext = decipher.update(cipherText);
        try {
            const authenticated = decipher.final();
            if (index > 0) secondaryKeyDecryptionSuccessCounter.inc();
            return Buffer.concat([plaintext, authenticated]).toString();
        } catch (error) {
            if (
                typeof error !== "object" ||
                error === null ||
                !("message" in error) ||
                error.message !==
                    "Unsupported state or unable to authenticate data"
            ) {
                throw error;
            }
        }
    }
    decryptionFailureAllKeysTriedCounter.inc();
    throw new Error("Kunne ikke dekryptere OBO-token");
}
