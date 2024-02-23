import { Button } from "@navikt/ds-react";
import {
    GyldigNesteHendelse,
    IASak,
    IASakshendelseType,
    IASakshendelseTypeEnum,
} from "../../../../../domenetyper/domenetyper";
import {
    useHentKartlegginger,
    useHentLeveranser,
} from "../../../../../api/lydia-api";
import { FullførLeveranserFørstModal } from "../FullførLeveranserFørstModal";
import { useState } from "react";
import { FullførKartleggingerFørstModal } from "../FullførKartleggingerFørstModal";

export const penskrivIASakshendelsestype = (
    hendelsestype: IASakshendelseType,
): string => {
    switch (hendelsestype) {
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
            return "Forrige status";
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_KARTLEGGES:
            return "Kartlegg";
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
            return "Bistå";
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
            return "Fullfør";
        case IASakshendelseTypeEnum.enum.SLETT_SAK:
            return "Tilbakestill";
    }
};

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
            return "primary";
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
        case IASakshendelseTypeEnum.enum.SLETT_SAK:
            return "danger";
        case IASakshendelseTypeEnum.enum.TILBAKE:
            return "secondary";
    }
};

export const useTrengerÅFullføreLeveranserFørst = (
    hendelsesType: IASakshendelseType,
    sak?: IASak,
): boolean => {
    if (sak === undefined) {
        return false;
    }
    const { data: leveranserPåSak } = useHentLeveranser(
        sak.orgnr,
        sak.saksnummer,
    );
    const harLeveranserSomErUnderArbeid =
        leveranserPåSak
            ?.flatMap((iaTjeneste) => iaTjeneste.leveranser)
            .some((leveranse) => leveranse.status === "UNDER_ARBEID") || false;

    switch (hendelsesType) {
        case IASakshendelseTypeEnum.enum.TILBAKE:
            return harLeveranserSomErUnderArbeid;
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
        case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_KARTLEGGES:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
        case IASakshendelseTypeEnum.enum.SLETT_SAK:
            return false;
    }
};

export const useTrengerÅFullføreKartleggingerFørst = (
    hendelsesType: IASakshendelseType,
    sak?: IASak,
): boolean => {
    if (sak === undefined) {
        return false;
    }

    const { data: kartleggingerPåSak } = useHentKartlegginger(
        sak.orgnr,
        sak.saksnummer,
    );
    const harKartleggingerSomErUnderArbeid =
        kartleggingerPåSak
            ?.flatMap((kartlegging) => kartlegging.status)
            .some((status) => status !== "AVSLUTTET") || false;

    switch (hendelsesType) {
        case IASakshendelseTypeEnum.enum.TILBAKE:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
            return harKartleggingerSomErUnderArbeid;
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
        case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_KARTLEGGES:
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
        case IASakshendelseTypeEnum.enum.SLETT_SAK:
            return false;
    }
};

export const erHendelsenDestruktiv = (hendelsesType: IASakshendelseType) =>
    knappeTypeFraSakshendelsesType(hendelsesType) === "danger";

export const sorterHendelserPåKnappeType = (
    a: GyldigNesteHendelse,
    b: GyldigNesteHendelse,
) =>
    ButtonVariant[
        knappeTypeFraSakshendelsesType(a.saksHendelsestype)
    ].valueOf() -
    ButtonVariant[
        knappeTypeFraSakshendelsesType(b.saksHendelsestype)
    ].valueOf();

interface Props {
    hendelsesType: IASakshendelseType;
    onClick: () => void;
    laster?: boolean;
    sak?: IASak;
}

export const IASakshendelseKnapp = ({
    hendelsesType,
    onClick,
    laster,
    sak,
}: Props) => {
    const trengerÅFullføreLeveranserFørst = useTrengerÅFullføreLeveranserFørst(
        hendelsesType,
        sak,
    );
    const trengerÅFullføreKartleggingerFørst =
        useTrengerÅFullføreKartleggingerFørst(hendelsesType, sak);
    const [visFullførLeveranserFørstModal, setVisFullførLeveranserFørstModal] =
        useState(false);
    const [
        visFullførKartleggingerFørstModal,
        setVisFullførKartleggingerFørstModal,
    ] = useState(false);

    if (trengerÅFullføreLeveranserFørst) {
        return (
            <>
                <IASakshendelseKnappInnhold
                    hendelsesType={hendelsesType}
                    onClick={() => setVisFullførLeveranserFørstModal(true)}
                    laster={laster}
                />
                <FullførLeveranserFørstModal
                    visModal={visFullførLeveranserFørstModal}
                    lukkModal={() => setVisFullførLeveranserFørstModal(false)}
                />
            </>
        );
    }
    if (trengerÅFullføreKartleggingerFørst) {
        return (
            <>
                <IASakshendelseKnappInnhold
                    hendelsesType={hendelsesType}
                    onClick={() => setVisFullførKartleggingerFørstModal(true)}
                    laster={laster}
                />
                <FullførKartleggingerFørstModal
                    visModal={visFullførKartleggingerFørstModal}
                    lukkModal={() =>
                        setVisFullførKartleggingerFørstModal(false)
                    }
                />
            </>
        );
    }

    return (
        <IASakshendelseKnappInnhold
            hendelsesType={hendelsesType}
            onClick={onClick}
            laster={laster}
        />
    );
};

function IASakshendelseKnappInnhold({
    hendelsesType,
    onClick,
    laster,
}: {
    hendelsesType: IASakshendelseType;
    onClick: () => void;
    laster?: boolean;
}) {
    return (
        <Button
            key={hendelsesType}
            disabled={laster}
            loading={laster}
            onClick={onClick}
            variant={knappeTypeFraSakshendelsesType(hendelsesType)}
            size={"small"}
        >
            {penskrivIASakshendelsestype(hendelsesType)}
        </Button>
    );
}
