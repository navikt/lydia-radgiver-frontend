import { Button } from "@navikt/ds-react";
import { GyldigNesteHendelse, IASakshendelseType, IASakshendelseTypeEnum } from "../../../../domenetyper/domenetyper";

export const penskrivIASakshendelsestype = (hendelsestype: IASakshendelseType): string => {
    switch (hendelsestype) {
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
            return "Vurder"
        case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
            return "Start ny vurdering"
        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
            return "Ta eierskap"
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
            return "Ta kontakt"
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
            return "Ikke aktuell"
        case IASakshendelseTypeEnum.enum.TILBAKE:
            return "Tilbake"
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_KARTLEGGES:
            return "Kartlegg"
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
            return "Bistå"
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
            return "Fullfør"
        case IASakshendelseTypeEnum.enum.SLETT_SAK:
            return "Tilbakestill"
    }
}

export enum ButtonVariant {
    "danger",
    "secondary",
    "primary",
    "tertiary"
}

type ButtonVariantType = keyof typeof ButtonVariant

export const knappeTypeFraSakshendelsesType = (hendelsesType: IASakshendelseType): ButtonVariantType => {
    switch (hendelsesType) {
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
        case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_KARTLEGGES:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
            return "primary"
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
        case IASakshendelseTypeEnum.enum.SLETT_SAK:
            return "danger"
        case IASakshendelseTypeEnum.enum.TILBAKE:
            return "secondary"
    }
}

export const erHendelsenDestruktiv = (hendelsesType: IASakshendelseType) =>
    knappeTypeFraSakshendelsesType(hendelsesType) === "danger"

export const sorterHendelserPåKnappeType = (a: GyldigNesteHendelse, b: GyldigNesteHendelse) =>
    ButtonVariant[knappeTypeFraSakshendelsesType(a.saksHendelsestype)].valueOf()
    - ButtonVariant[knappeTypeFraSakshendelsesType(b.saksHendelsestype)].valueOf()

interface Props {
    hendelsesType: IASakshendelseType
    onClick: () => void
}

export const IASakshendelseKnapp = ({hendelsesType, onClick}: Props) => {
    return (
        <Button
            key={hendelsesType}
            onClick={onClick}
            variant={knappeTypeFraSakshendelsesType(hendelsesType)}
            size={"small"}
        >
            {penskrivIASakshendelsestype(hendelsesType)}
        </Button>
    )
}
