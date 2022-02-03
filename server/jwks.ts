import {FlattenedJWSInput, GetKeyFunction, JWK, JWSHeaderParameters} from "jose/dist/types/types";
import {createRemoteJWKSet, generateKeyPair, exportJWK, createLocalJWKSet} from "jose";
import {URL} from "url";

export type JWKSetRetriever = GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>
export let _remoteJwkSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>

export async function setupRemoteJwkSet(): Promise<JWKSetRetriever> {
    if (!_remoteJwkSet) {
        _remoteJwkSet = createRemoteJWKSet(new URL(process.env.AZURE_OPENID_CONFIG_JWKS_URI), {
            cooldownDuration: 1000 * 60 * 60 // 1 time caching av jwks
        })
    }
    return _remoteJwkSet
}

export function setupLocalJwkSet(keys: JWK[] ) {
    return createLocalJWKSet({
        keys
    })
}

export async function generateLocalKeys() {
    const { publicKey, privateKey } = await generateKeyPair(`RS256`);
    return {publicJwkKeys: [await exportJWK(publicKey)], privateKey }
}