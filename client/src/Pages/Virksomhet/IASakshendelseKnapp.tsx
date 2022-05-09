import {Button} from "@navikt/ds-react";
import {
    GyldigNesteHendelse, IASakshendelseType, IASakshendelseTypeEnum,
} from "../../domenetyper";

export const oversettNavnPåSakshendelsestype = (hendelsestype: IASakshendelseType): string => {
    switch (hendelsestype) {
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
            return "Virksomhet vurderes"

        case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
            return "Opprett sak for virksomhet"

        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
            return "Ta eierskap i sak"

        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
            return "Virksomhet skal kontaktes"

        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
            return "Virksomhet er ikke aktuell"
    }
}

type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger"

export const knappeTypeFraSakshendelsesType = (hendelsesType: IASakshendelseType): ButtonVariant => {
    switch (hendelsesType) {
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
            return "primary"

        case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
            return "primary"

        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
            return "primary"

        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
            return "primary"

        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
            return "danger"
    }
}

interface Props {
    hendelse: GyldigNesteHendelse
    onClick: () => void
}

export const IASakshendelseKnapp = ({hendelse, onClick}: Props) => {
    return (
        <Button
            key={hendelse.saksHendelsestype}
            onClick={onClick}
            variant={knappeTypeFraSakshendelsesType(hendelse.saksHendelsestype)}
        >
            {oversettNavnPåSakshendelsestype(
                hendelse.saksHendelsestype
            )}
        </Button>
    )
}
