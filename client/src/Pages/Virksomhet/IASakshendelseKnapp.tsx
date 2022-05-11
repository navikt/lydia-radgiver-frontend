import {Button} from "@navikt/ds-react";
import {
    GyldigNesteHendelse, IASakshendelseType, IASakshendelseTypeEnum,
} from "../../domenetyper";

export const oversettNavnPåSakshendelsestype = (hendelsestype: IASakshendelseType): string => {
    switch (hendelsestype) {
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
            return "Vurderes"

        case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
            return "Opprett sak"

        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
            return "Ta eierskap"

        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
            return "Kontaktes"

        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
            return "Ikke aktuell"
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
            {oversettNavnPåSakshendelsestype(
                hendelsesType
            )}
        </Button>
    )
}
