import { Brukerinformasjon } from "../../../domenetyper/brukerinformasjon";

const TRE_TIMER_MS = 1000 * 60 * 60 * 3
const FEM_SEKUNDER_MS = 1000 * 5

export const brukerMedGyldigToken : Brukerinformasjon = {
    navn: "Gyldig Bruker",
    ident: "B12345",
    epost: "a@b.com",
    rolle: "Superbruker",
    tokenUtløper: Date.now() + TRE_TIMER_MS
}

export const brukerMedTokenSomHolderPåÅLøpeUt : Brukerinformasjon = {
    navn: "Utgått Bruker",
    ident: "U12345",
    epost: "a@b.com",
    rolle: "Superbruker",
    tokenUtløper: Date.now() + FEM_SEKUNDER_MS
}

export const brukerMedVeldigLangtNavn : Brukerinformasjon = {
    navn: "Albus Persifal Ulfrik Brian Humlesnurr",
    ident: "NAV-54321",
    epost: "a@b.com",
    rolle: "Superbruker",
    tokenUtløper: Date.now() + TRE_TIMER_MS
}

export const brukerSomErSaksbehandler : Brukerinformasjon = {
    navn: "Minerva McSnurp",
    ident: "S12345",
    epost: "a@b.com",
    rolle: "Saksbehandler",
    tokenUtløper: Date.now() + TRE_TIMER_MS
}
