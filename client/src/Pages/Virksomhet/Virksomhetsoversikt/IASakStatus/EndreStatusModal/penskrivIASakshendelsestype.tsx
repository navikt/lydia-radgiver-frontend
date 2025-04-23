import {
    IASakshendelseType,
    IASakshendelseTypeEnum,
} from "../../../../../domenetyper/domenetyper";

export const penskrivIASakshendelsestype = (
    hendelsestype: IASakshendelseType,
): string => {
    switch (hendelsestype) {
        case IASakshendelseTypeEnum.enum.NY_PROSESS:
            return "Ny prosess";
        case IASakshendelseTypeEnum.enum.ENDRE_PROSESS:
            return "Endre prosess";
        case IASakshendelseTypeEnum.enum.SLETT_PROSESS:
            return "Slett prosess";
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
            return "Vurder";
        case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
            return "Start ny vurdering";
        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
            return "Ta eierskap";
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
            return "Ta kontakt";
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
            return "Ikke aktuell";
        case IASakshendelseTypeEnum.enum.TILBAKE:
            return "Forrige";
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_KARTLEGGES:
            return "Kartlegg";
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
            return "Bistå";
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
            return "Fullfør";
        case IASakshendelseTypeEnum.enum.SLETT_SAK:
            return "Tilbakestill";
        case IASakshendelseTypeEnum.enum.FULLFØR_PROSESS:
            return "Fullfør prosess";
        case IASakshendelseTypeEnum.enum.AVBRYT_PROSESS:
            return "Avbryt prosess";
    }
};
