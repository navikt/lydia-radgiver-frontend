import {
    GyldigNesteHendelse,
    IAProsessStatusEnum,
    IASak,
    IASakshendelseType,
    IASakshendelseTypeEnum
} from "../../../domenetyper/domenetyper";
import { ulid } from "ulid";


const saksnummer = ulid();
const endretAv = ulid();
const orgnr = "987654321";
const navIdent1 = "NAV-12345";
const navIdent2 = "NAV-54321";

export const ikkeAktuellHendelseMock: GyldigNesteHendelse = {
    saksHendelsestype: IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL,
    gyldigeÅrsaker: [
        {
            type: "ÅRSAK_1",
            navn: "Årsak 1",
            begrunnelser: [
                {
                    type: "BEGRUNNELSE_1_1",
                    navn: "Begrunnelse 1.1"
                },
                {
                    type: "BEGRUNNELSE_1_2",
                    navn: "Begrunnelse 1.2"
                }
            ]
        },
        {
            type: "ÅRSAK_2",
            navn: "Årsak 2",
            begrunnelser: [
                {
                    type: "BEGRUNNELSE_2_1",
                    navn: "Begrunnelse 2.1"
                }, {
                    type: "BEGRUNNELSE_2_2",
                    navn: "Begrunnelse 2.2"
                }
            ]
        }
    ]
}

const hendelseUtenÅrsak = (saksHendelsetype: IASakshendelseType) => {
    return {
        saksHendelsestype: saksHendelsetype,
        gyldigeÅrsaker: []
    }
}

export const iaSakVurderesUtenEier: IASak = {
    saksnummer: saksnummer,
    orgnr: orgnr,
    opprettetTidspunkt: new Date(),
    opprettetAv: navIdent1,
    endretTidspunkt: new Date(),
    endretAv: navIdent2,
    eidAv: null,
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.VURDERES,
    gyldigeNesteHendelser: [hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK), hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.SLETT_SAK)],
    lukket: false
}

export const iaSakVurderesMedEier: IASak = {
    saksnummer: saksnummer,
    orgnr: orgnr,
    opprettetTidspunkt: new Date(),
    opprettetAv: navIdent1,
    endretTidspunkt: new Date(),
    endretAv: navIdent2,
    eidAv: navIdent2,
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.VURDERES,
    gyldigeNesteHendelser: [
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES)
    ],
    lukket: false
}

export const iaSakKontaktes: IASak = {
    saksnummer: saksnummer,
    orgnr: orgnr,
    opprettetTidspunkt: new Date(),
    opprettetAv: navIdent1,
    endretTidspunkt: new Date(),
    endretAv: navIdent2,
    eidAv: navIdent2,
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.KONTAKTES,
    gyldigeNesteHendelser: [
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TILBAKE)
    ],
    lukket: false
}

export const iaSakIkkeAktuell: IASak = {
    saksnummer: saksnummer,
    orgnr: orgnr,
    opprettetTidspunkt: new Date(),
    opprettetAv: navIdent1,
    endretTidspunkt: new Date(),
    endretAv: navIdent2,
    eidAv: navIdent2,
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.IKKE_AKTUELL,
    gyldigeNesteHendelser: [hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TILBAKE)],
    lukket: false
}

export const iaSakKartlegges: IASak = {
    saksnummer: saksnummer,
    orgnr: orgnr,
    opprettetTidspunkt: new Date(),
    opprettetAv: navIdent1,
    endretTidspunkt: new Date(),
    endretAv: navIdent2,
    eidAv: navIdent2,
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.KARTLEGGES,
    gyldigeNesteHendelser: [
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TILBAKE)
    ],
    lukket: false
}

export const iaSakViBistår: IASak = {
    saksnummer: saksnummer,
    orgnr: orgnr,
    opprettetTidspunkt: new Date(),
    opprettetAv: navIdent1,
    endretTidspunkt: new Date(),
    endretAv: navIdent2,
    eidAv: navIdent2,
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.VI_BISTÅR,
    gyldigeNesteHendelser: [
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.FULLFØR_BISTAND),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TILBAKE)
    ],
    lukket: false
}

export const iaSakFullført: IASak = {
    saksnummer: saksnummer,
    orgnr: orgnr,
    opprettetTidspunkt: new Date(),
    opprettetAv: navIdent1,
    endretTidspunkt: new Date(),
    endretAv: navIdent2,
    eidAv: navIdent2,
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.FULLFØRT,
    gyldigeNesteHendelser: [
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TILBAKE)
    ],
    lukket: false
}

export const iaSakFullførtOgLukket: IASak = {
    saksnummer: saksnummer,
    orgnr: orgnr,
    opprettetTidspunkt: new Date(),
    opprettetAv: navIdent1,
    endretTidspunkt: new Date(),
    endretAv: navIdent2,
    eidAv: navIdent2,
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.FULLFØRT,
    gyldigeNesteHendelser: [],
    lukket: true
}

export const iaSakIngenAktivitetPåOverEtKvartal: IASak = {
    saksnummer: saksnummer,
    orgnr: orgnr,
    opprettetTidspunkt: new Date(2000, 11, 29),
    opprettetAv: navIdent1,
    endretTidspunkt: new Date(2000, 11, 31),
    endretAv: navIdent2,
    eidAv: navIdent2,
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.KARTLEGGES,
    gyldigeNesteHendelser: [
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TILBAKE)
    ],
    lukket: false
}
