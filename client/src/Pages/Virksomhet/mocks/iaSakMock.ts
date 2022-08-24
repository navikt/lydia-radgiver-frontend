import {
    GyldigNesteHendelse,
    IAProsessStatusEnum,
    IASak,
    IASakshendelseType,
    IASakshendelseTypeEnum
} from "../../../domenetyper";
import {ulid} from "ulid";


const saksnummer = ulid()
const endretAv = ulid()

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
    orgnr: "987654321",
    opprettetTidspunkt: new Date(),
    opprettetAv: "NAV-12345",
    endretTidspunkt: new Date(),
    endretAv: "NAV-54321",
    eidAv: null,
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.VURDERES,
    gyldigeNesteHendelser: [ikkeAktuellHendelseMock, hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK)]
}

export const iaSakVurderesMedEier: IASak = {
    saksnummer: saksnummer,
    orgnr: "987654321",
    opprettetTidspunkt: new Date(),
    opprettetAv: "NAV-12345",
    endretTidspunkt: new Date(),
    endretAv: "NAV-54321",
    eidAv: "NAV-54321",
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.VURDERES,
    gyldigeNesteHendelser: [
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES)
    ]
}

export const iaSakKontaktes: IASak = {
    saksnummer: saksnummer,
    orgnr: "987654321",
    opprettetTidspunkt: new Date(),
    opprettetAv: "NAV-12345",
    endretTidspunkt: new Date(),
    endretAv: "NAV-54321",
    eidAv: "NAV-54321",
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.KONTAKTES,
    gyldigeNesteHendelser: [
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TILBAKE)
    ]
}

export const iaSakIkkeAktuell: IASak = {
    saksnummer: saksnummer,
    orgnr: "987654321",
    opprettetTidspunkt: new Date(),
    opprettetAv: "NAV-12345",
    endretTidspunkt: new Date(),
    endretAv: "NAV-54321",
    eidAv: "NAV-54321",
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.IKKE_AKTUELL,
    gyldigeNesteHendelser: [hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TILBAKE)]
}

export const iaSakKartlegges: IASak = {
    saksnummer: saksnummer,
    orgnr: "987654321",
    opprettetTidspunkt: new Date(),
    opprettetAv: "NAV-12345",
    endretTidspunkt: new Date(),
    endretAv: "NAV-54321",
    eidAv: "NAV-54321",
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.KARTLEGGES,
    gyldigeNesteHendelser: [
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TILBAKE)
    ]
}

export const iaSakViBistår: IASak = {
    saksnummer: saksnummer,
    orgnr: "987654321",
    opprettetTidspunkt: new Date(),
    opprettetAv: "NAV-12345",
    endretTidspunkt: new Date(),
    endretAv: "NAV-54321",
    eidAv: "NAV-54321",
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.VI_BISTÅR,
    gyldigeNesteHendelser: [
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.FULLFØR_BISTAND),
        hendelseUtenÅrsak(IASakshendelseTypeEnum.enum.TILBAKE)
    ]
}

export const iaSakFullført: IASak = {
    saksnummer: saksnummer,
    orgnr: "987654321",
    opprettetTidspunkt: new Date(),
    opprettetAv: "NAV-12345",
    endretTidspunkt: new Date(),
    endretAv: "NAV-54321",
    eidAv: "NAV-54321",
    endretAvHendelseId: endretAv,
    status: IAProsessStatusEnum.enum.FULLFØRT,
    gyldigeNesteHendelser: []
}
