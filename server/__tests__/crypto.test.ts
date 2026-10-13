import { decrypt, encrypt, validateEncryptionKeys } from "../crypto";

const nøkkelFørRotasjon = "previous-test-key";
const nøkkelEtterRotasjon = "next-test-key";
const opprinneligNøkkel = process.env.OBO_TOKEN_ENC_KEY;
const opprinneligForrigeNøkkel = process.env.OBO_TOKEN_ENC_KEY_PREVIOUS;
const opprinneligNesteNøkkel = process.env.OBO_TOKEN_ENC_KEY_NEXT;

beforeEach(() => {
    // Testene starter før rotasjonen og bytter aktiv nøkkel når scenariet krever det.
    process.env.OBO_TOKEN_ENC_KEY = nøkkelFørRotasjon;
    delete process.env.OBO_TOKEN_ENC_KEY_PREVIOUS;
    delete process.env.OBO_TOKEN_ENC_KEY_NEXT;
});

afterEach(() => {
    for (const [navn, verdi] of [
        ["OBO_TOKEN_ENC_KEY", opprinneligNøkkel],
        ["OBO_TOKEN_ENC_KEY_PREVIOUS", opprinneligForrigeNøkkel],
        ["OBO_TOKEN_ENC_KEY_NEXT", opprinneligNesteNøkkel],
    ] as const) {
        if (verdi === undefined) delete process.env[navn];
        else process.env[navn] = verdi;
    }
});

describe("Kryptering av OBO-token", () => {
    it("krypterer samme melding ulikt og dekrypterer begge verdiene", async () => {
        const melding = "TIL VALHALL!!";
        const [førsteKrypterte, andreKrypterte] = await Promise.all([
            encrypt(melding),
            encrypt(melding),
        ]);
        expect(førsteKrypterte).not.toBe(andreKrypterte);
        const alleDekrypteresTilSammeMelding = (
            await Promise.all([
                decrypt(førsteKrypterte),
                decrypt(andreKrypterte),
            ])
        ).every((dekryptert) => dekryptert === melding);
        expect(alleDekrypteresTilSammeMelding).toBeTruthy();
    });

    it("leser et token kryptert med gammel nøkkel etter bytte av aktiv nøkkel", async () => {
        const kryptert = await encrypt("old token");

        process.env.OBO_TOKEN_ENC_KEY = nøkkelEtterRotasjon;
        process.env.OBO_TOKEN_ENC_KEY_PREVIOUS = nøkkelFørRotasjon;
        expect(await decrypt(kryptert)).toBe("old token");
    });

    it("lar en eldre pod lese et token kryptert med ny nøkkel", async () => {
        // Ny pod krypterer med ny aktiv nøkkel.
        process.env.OBO_TOKEN_ENC_KEY = nøkkelEtterRotasjon;
        const kryptert = await encrypt("new token");

        // Eldre pod bruker gammel aktiv nøkkel, men kan lese med den nye.
        process.env.OBO_TOKEN_ENC_KEY = nøkkelFørRotasjon;
        process.env.OBO_TOKEN_ENC_KEY_NEXT = nøkkelEtterRotasjon;
        expect(await decrypt(kryptert)).toBe("new token");
    });

    it("avviser et token når ingen konfigurerte nøkler autentiserer det", async () => {
        // encrypt() bruker nøkkelFørRotasjon, som beforeEach satte som aktiv nøkkel.
        const kryptert = await encrypt("private test token");

        process.env.OBO_TOKEN_ENC_KEY = nøkkelEtterRotasjon;
        await expect(decrypt(kryptert)).rejects.toThrow();
    });

    it("avviser endret ciphertext selv med riktig nøkkel", async () => {
        // OBO_TOKEN_ENC_KEY_NEXT er bare en lesenøkkel; encrypt() bruker fortsatt nøkkelFørRotasjon.
        process.env.OBO_TOKEN_ENC_KEY_NEXT = nøkkelEtterRotasjon;
        const kryptert = Buffer.from(
            await encrypt("private test token"),
            "base64",
        );
        kryptert[kryptert.length - 1] ^= 1; // Endrer én bit for å teste at AES-GCM avviser manipulering.

        await expect(decrypt(kryptert.toString("base64"))).rejects.toThrow();
    });

    it("avviser manglende eller tomme krypteringsnøkler", () => {
        delete process.env.OBO_TOKEN_ENC_KEY;
        expect(validateEncryptionKeys).toThrow("OBO_TOKEN_ENC_KEY");

        process.env.OBO_TOKEN_ENC_KEY = nøkkelFørRotasjon;
        process.env.OBO_TOKEN_ENC_KEY_NEXT = " ";
        expect(validateEncryptionKeys).toThrow("Overgangsnøkler");
    });

    it("avviser avkortede krypterte tokener", async () => {
        await expect(decrypt("invalid")).rejects.toThrow(
            "Ugyldig kryptert OBO-token",
        );
    });
});
