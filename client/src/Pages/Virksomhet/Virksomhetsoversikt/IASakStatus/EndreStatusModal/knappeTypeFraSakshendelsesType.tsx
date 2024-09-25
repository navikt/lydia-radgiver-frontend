import {
    IASakshendelseType,
    IASakshendelseTypeEnum,
} from "../../../../../domenetyper/domenetyper";

export enum ButtonVariant {
    "danger",
    "secondary",
    "primary",
    "tertiary",
}

type ButtonVariantType = keyof typeof ButtonVariant;

export const knappeTypeFraSakshendelsesType = (
    hendelsesType: IASakshendelseType,
): ButtonVariantType => {
    switch (hendelsesType) {
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
        case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_KARTLEGGES:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
        case IASakshendelseTypeEnum.enum.ENDRE_PROSESS:
        case IASakshendelseTypeEnum.enum.NY_PROSESS:
        case IASakshendelseTypeEnum.enum.SLETT_PROSESS:
            return "primary";
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
        case IASakshendelseTypeEnum.enum.SLETT_SAK:
            return "danger";
        case IASakshendelseTypeEnum.enum.TILBAKE:
            return "secondary";
    }
};
