import { decrypt, encrypt } from "../crypto";

describe("crypto", () => {
    process.env.OBO_TOKEN_ENC_KEY = "Laila";
    it("should encrypt and decrypt properly", async () => {
        const message = "TIL VALHALL!!";
        const [encryptedFirst, encryptedSecond] = await Promise.all([
            encrypt(message),
            encrypt(message),
        ]);
        expect(encryptedFirst).not.toBe(encryptedSecond);
        const allDecryptToSame = await (
            await Promise.all([
                decrypt(encryptedFirst),
                decrypt(encryptedFirst),
            ])
        ).every((decrypted) => decrypted === message);
        expect(allDecryptToSame).toBeTruthy();
    });
});
