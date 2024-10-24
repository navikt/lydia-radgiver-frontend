import { Button, ButtonProps, Detail } from "@navikt/ds-react";
import React from "react";
import {
    GyldigNesteHendelse,
    IASak,
    IASakshendelseTypeEnum,
} from "../../../../../domenetyper/domenetyper";
import { useHentSamarbeidshistorikk } from "../../../../../api/lydia-api/virksomhet";
import { useHentAktivSakForVirksomhet } from "../../../../../api/lydia-api/virksomhet";
import { nyHendelsePåSak } from "../../../../../api/lydia-api/sak";
import { loggStatusendringPåSak } from "../../../../../util/amplitude-klient";
import { StatusHendelseSteg } from "./Statusknapper";
import { ChevronLeftIcon, ChevronRightIcon } from "@navikt/aksel-icons";
import { useTrengerÅFullføreLeveranserFørst } from "./useTrengerÅFullføreLeveranserFørst";
import { penskrivIASakshendelsestype } from "./penskrivIASakshendelsestype";
import { useTrengerÅFullføreBehovsvurderingerFørst } from "./useTrengerÅFullføreBehovsvurderingerFørst";
import { useHentSamarbeid } from "../../../../../api/lydia-api/kartlegging";
import { useHentLeveranser } from "../../../../../api/lydia-api/leveranse";

export default function KnappForHendelse({
    hendelse,
    sak,
    nesteSteg,
    setNesteSteg,
    variant = "secondary",
    onStatusEndret,
}: {
    hendelse: GyldigNesteHendelse;
    sak: IASak;
    nesteSteg: StatusHendelseSteg | null;
    setNesteSteg: (n: {
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    }) => void;
    variant?: ButtonProps["variant"];
    onStatusEndret: (status: IASak["status"]) => void;
}) {
    const disabled = nesteSteg !== null;

    switch (hendelse.saksHendelsestype) {
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_ER_IKKE_AKTUELL:
            return (
                <IkkeAktuellKnapp
                    sak={sak}
                    hendelse={hendelse}
                    setNesteSteg={setNesteSteg}
                    disabled={disabled}
                    variant={variant}
                />
            );
        case IASakshendelseTypeEnum.enum.FULLFØR_BISTAND:
        case IASakshendelseTypeEnum.enum.TILBAKE:
        case IASakshendelseTypeEnum.enum.TA_EIERSKAP_I_SAK:
            return (
                <HendelseMåBekreftesKnapp
                    sak={sak}
                    hendelse={hendelse}
                    setNesteSteg={setNesteSteg}
                    disabled={disabled}
                    variant={variant}
                />
            );
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_VURDERES:
        case IASakshendelseTypeEnum.enum.OPPRETT_SAK_FOR_VIRKSOMHET:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_KONTAKTES:
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_KARTLEGGES:
        case IASakshendelseTypeEnum.enum.SLETT_SAK:
            return (
                <RettTilNesteStatusKnapp
                    sak={sak}
                    hendelse={hendelse}
                    disabled={disabled}
                    variant={variant}
                    onStatusEndret={onStatusEndret}
                />
            );
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
            return (
                <BiståEllerSamarbeidKnapp
                    hendelse={hendelse}
                    sak={sak}
                    variant={variant}
                    onStatusEndret={onStatusEndret}
                />
            );
        case IASakshendelseTypeEnum.enum.ENDRE_PROSESS:
        case IASakshendelseTypeEnum.enum.NY_PROSESS:
        default:
            return <></>;
    }
}

function BiståEllerSamarbeidKnapp({
    sak,
    hendelse,
    variant,
    onStatusEndret,
}: {
    hendelse: GyldigNesteHendelse;
    sak: IASak;
    variant: ButtonProps["variant"];
    onStatusEndret: (status: IASak["status"]) => void;
}) {
    const { data: alleSamarbeid } = useHentSamarbeid(sak.orgnr, sak.saksnummer);

    if (alleSamarbeid === undefined) {
        return <></>;
    }
    if (alleSamarbeid.length === 0) {
        return <Detail>Du må opprette et samarbeid først</Detail>;
    }

    return (
        alleSamarbeid && (
            <RettTilNesteStatusKnapp
                sak={sak}
                hendelse={hendelse}
                disabled={false}
                variant={variant}
                onStatusEndret={onStatusEndret}
            />
        )
    );
}

function IkkeAktuellKnapp({
    sak,
    hendelse,
    setNesteSteg,
    disabled,
    variant,
}: {
    sak: IASak;
    hendelse: GyldigNesteHendelse;
    setNesteSteg: (n: {
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    }) => void;
    disabled: boolean;
    variant?: ButtonProps["variant"];
}) {
    const { data: leveranserPåSak } = useHentLeveranser(
        sak.orgnr,
        sak.saksnummer,
    );
    const harLeveranserSomErUnderArbeid = leveranserPåSak
        ?.flatMap((iaTjeneste) => iaTjeneste.leveranser)
        .some((leveranse) => leveranse.status === "UNDER_ARBEID");

    const harKartleggingerSomErUnderArbeid =
        useTrengerÅFullføreBehovsvurderingerFørst(
            hendelse.saksHendelsestype,
            sak,
        );

    return (
        <Button
            disabled={disabled}
            variant={variant}
            size="small"
            onClick={() => {
                if (harLeveranserSomErUnderArbeid) {
                    setNesteSteg({ nesteSteg: "FULLFØR_LEVERANSE", hendelse });
                } else if (harKartleggingerSomErUnderArbeid) {
                    setNesteSteg({
                        nesteSteg: "FULLFØR_KARTLEGGINGER",
                        hendelse,
                    });
                } else {
                    setNesteSteg({ nesteSteg: "BEGRUNNELSE", hendelse });
                }
            }}
        >
            {penskrivIASakshendelsestype(hendelse.saksHendelsestype)}
        </Button>
    );
}

function HendelseMåBekreftesKnapp({
    hendelse,
    setNesteSteg,
    disabled,
    variant,
    sak,
}: {
    sak: IASak;
    hendelse: GyldigNesteHendelse;
    setNesteSteg: (n: {
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    }) => void;
    disabled: boolean;
    variant?: ButtonProps["variant"];
}) {
    const trengerÅFullføreLeveranserFørst = useTrengerÅFullføreLeveranserFørst(
        hendelse.saksHendelsestype,
        sak,
    );

    const trengerÅFullføreKartleggingerFørst =
        useTrengerÅFullføreBehovsvurderingerFørst(
            hendelse.saksHendelsestype,
            sak,
        );

    const trengerÅFullførePlanFørst = false;
    // useTrengerÅFullføreSamarbeidsplanFørst(
    //     hendelse.saksHendelsestype,
    //     sak,
    // );

    let nesteSteg: StatusHendelseSteg | null = "BEKREFT";
    if (trengerÅFullføreLeveranserFørst) {
        nesteSteg = "FULLFØR_LEVERANSE";
    } else if (trengerÅFullføreKartleggingerFørst) {
        nesteSteg = "FULLFØR_KARTLEGGINGER";
    } else if (trengerÅFullførePlanFørst) {
        nesteSteg = "FULLFØR_SAMARBEIDSPLAN";
    }

    const bekreftNyHendelsePåSak = () => {
        setNesteSteg({ nesteSteg, hendelse });
    };

    const erTilbake = hendelse.saksHendelsestype === "TILBAKE";
    const Chevron = erTilbake ? ChevronLeftIcon : ChevronRightIcon;

    return (
        <Button
            icon={<Chevron />}
            iconPosition={erTilbake ? "left" : "right"}
            disabled={disabled}
            variant={variant}
            size="small"
            onClick={bekreftNyHendelsePåSak}
        >
            {penskrivIASakshendelsestype(hendelse.saksHendelsestype)}
        </Button>
    );
}

function RettTilNesteStatusKnapp({
    sak,
    hendelse,
    disabled,
    variant,
    onStatusEndret,
}: {
    sak: IASak;
    hendelse: GyldigNesteHendelse;
    disabled: boolean;
    variant?: ButtonProps["variant"];
    onStatusEndret: (status: IASak["status"]) => void;
}) {
    const { mutate: mutateSamarbeidshistorikk } = useHentSamarbeidshistorikk(
        sak.orgnr,
    );
    const { mutate: mutateHentSaker } = useHentAktivSakForVirksomhet(sak.orgnr);

    const mutateIASakerOgSamarbeidshistorikk = () => {
        mutateHentSaker?.();
        mutateSamarbeidshistorikk?.();
    };

    const trykkPåSakhendelsesknapp = () => {
        nyHendelsePåSak(sak, hendelse)
            .then(mutateIASakerOgSamarbeidshistorikk)
            .then(() => {
                loggStatusendringPåSak(hendelse.saksHendelsestype, sak.status);
                onStatusEndret(sak.status);
            });
    };

    const erTilbake =
        hendelse.saksHendelsestype === "TILBAKE" ||
        hendelse.saksHendelsestype === "SLETT_SAK";
    const Chevron = erTilbake ? ChevronLeftIcon : ChevronRightIcon;

    return (
        <Button
            icon={<Chevron />}
            iconPosition={erTilbake ? "left" : "right"}
            disabled={disabled}
            variant={variant}
            size="small"
            onClick={trykkPåSakhendelsesknapp}
        >
            {penskrivIASakshendelsestype(hendelse.saksHendelsestype)}
        </Button>
    );
}
