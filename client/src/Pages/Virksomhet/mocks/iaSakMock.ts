import {IASak} from "../../../domenetyper";
import {ulid} from "ulid";


const saksnummer = ulid()
const endretAv = ulid()

export const iaSakVurderes: IASak = {
    saksnummer: saksnummer,
    orgnr: "987654321",
    type: "NAV_STOTTER",
    opprettet: new Date(),
    opprettetAv: "NAV-12345",
    endret: new Date(),
    endretAv: "NAV-54321",
    endretAvHendelseId: endretAv,
    status: "VURDERES"
}

export const iaSakKontaktes: IASak = {
    saksnummer: saksnummer,
    orgnr: "987654321",
    type: "NAV_STOTTER",
    opprettet: new Date(),
    opprettetAv: "NAV-12345",
    endret: new Date(),
    endretAv: "NAV-54321",
    endretAvHendelseId: endretAv,
    status: "KONTAKTES"
}

export const iaSakIkkeAktuell: IASak = {
    saksnummer: saksnummer,
    orgnr: "987654321",
    type: "NAV_STOTTER",
    opprettet: new Date(),
    opprettetAv: "NAV-12345",
    endret: new Date(),
    endretAv: "NAV-54321",
    endretAvHendelseId: endretAv,
    status: "IKKE_AKTUELL"
}