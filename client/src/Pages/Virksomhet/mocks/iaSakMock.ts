import {IASak} from "../../../domenetyper";
import {ulid} from "ulid";


const saksnummer = ulid()
const endretAv = ulid()

export const iaSakVurderesUtenEier: IASak = {
    saksnummer: saksnummer,
    orgnr: "987654321",
    type: "NAV_STOTTER",
    opprettet: new Date(),
    opprettetAv: "NAV-12345",
    endret: new Date(),
    endretAv: "NAV-54321",
    eidAv: undefined,
    endretAvHendelseId: endretAv,
    status: "VURDERES",
    gyldigeNesteHendelser: ["VIRKSOMHET_ER_IKKE_AKTUELL", "TA_EIERSKAP_I_SAK"]
}

export const iaSakVurderesMedEier: IASak = {
    saksnummer: saksnummer,
    orgnr: "987654321",
    type: "NAV_STOTTER",
    opprettet: new Date(),
    opprettetAv: "NAV-12345",
    endret: new Date(),
    endretAv: "NAV-54321",
    eidAv: "NAV-54321",
    endretAvHendelseId: endretAv,
    status: "VURDERES",
    gyldigeNesteHendelser: ["VIRKSOMHET_ER_IKKE_AKTUELL", "VIRKSOMHET_SKAL_KONTAKTES"]
}

export const iaSakKontaktes: IASak = {
    saksnummer: saksnummer,
    orgnr: "987654321",
    type: "NAV_STOTTER",
    opprettet: new Date(),
    opprettetAv: "NAV-12345",
    endret: new Date(),
    endretAv: "NAV-54321",
    eidAv: "NAV-54321",
    endretAvHendelseId: endretAv,
    status: "KONTAKTES",
    gyldigeNesteHendelser: []
}

export const iaSakIkkeAktuell: IASak = {
    saksnummer: saksnummer,
    orgnr: "987654321",
    type: "NAV_STOTTER",
    opprettet: new Date(),
    opprettetAv: "NAV-12345",
    endret: new Date(),
    endretAv: "NAV-54321",
    eidAv: "NAV-54321",
    endretAvHendelseId: endretAv,
    status: "IKKE_AKTUELL",
    gyldigeNesteHendelser: []
}