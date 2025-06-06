import { Button, ButtonProps } from "@navikt/ds-react";
import React from "react";
import {
    GyldigNesteHendelse,
    IASak,
    IASakshendelseTypeEnum,
} from "../../../../../domenetyper/domenetyper";
import {
    useHentSakForVirksomhet,
    useHentSakshistorikk,
} from "../../../../../api/lydia-api/virksomhet";
import { nyHendelsePåSak } from "../../../../../api/lydia-api/sak";
import { loggStatusendringPåSak } from "../../../../../util/amplitude-klient";
import { StatusHendelseSteg } from "./Statusknapper";
import { ChevronLeftIcon, ChevronRightIcon } from "@navikt/aksel-icons";
import { penskrivIASakshendelsestype } from "./penskrivIASakshendelsestype";
import { useTrengerÅFullføreBehovsvurderingerFørst } from "./useTrengerÅFullføreBehovsvurderingerFørst";
import { useHentSamarbeid } from "../../../../../api/lydia-api/spørreundersøkelse";
import { useTrengerÅFullføreSamarbeidFørst } from "./useTrengerÅFullføreSamarbeidFørst";

export default function KnappForHendelse({
    hendelse,
    sak,
    nesteSteg,
    setNesteSteg,
    variant = "secondary",
    onStatusEndret,
    loading,
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
    loading?: ButtonProps["loading"];
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
                    loading={loading}
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
                    loading={loading}
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
                    loading={loading}
                />
            );
        case IASakshendelseTypeEnum.enum.VIRKSOMHET_SKAL_BISTÅS:
            return (
                <BiståEllerSamarbeidKnapp
                    hendelse={hendelse}
                    sak={sak}
                    variant={variant}
                    onStatusEndret={onStatusEndret}
                    loading={loading}
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
    loading,
}: {
    hendelse: GyldigNesteHendelse;
    sak: IASak;
    variant: ButtonProps["variant"];
    onStatusEndret: (status: IASak["status"]) => void;
    loading?: ButtonProps["loading"];
}) {
    const { data: alleSamarbeid } = useHentSamarbeid(sak.orgnr, sak.saksnummer);

    if (alleSamarbeid === undefined) {
        return <></>;
    }
    if (alleSamarbeid.length === 0) {
        return (
            <RettTilNesteStatusKnapp
                sak={sak}
                hendelse={hendelse}
                disabled={true}
                variant={variant}
                onStatusEndret={onStatusEndret}
                loading={loading}
            />
        );
    }

    return (
        alleSamarbeid && (
            <RettTilNesteStatusKnapp
                sak={sak}
                hendelse={hendelse}
                disabled={false}
                variant={variant}
                onStatusEndret={onStatusEndret}
                loading={loading}
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
    loading,
}: {
    sak: IASak;
    hendelse: GyldigNesteHendelse;
    setNesteSteg: (n: {
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    }) => void;
    disabled: boolean;
    variant?: ButtonProps["variant"];
    loading?: ButtonProps["loading"];
}) {
    const trengerÅFullføreSamarbeidFørst = useTrengerÅFullføreSamarbeidFørst(
        hendelse.saksHendelsestype,
        sak,
    );

    return (
        <Button
            disabled={disabled}
            variant={variant}
            size="small"
            onClick={() => {
                if (trengerÅFullføreSamarbeidFørst) {
                    setNesteSteg({
                        nesteSteg: "FULLFØR_SAMARBEID",
                        hendelse,
                    });
                } else {
                    setNesteSteg({ nesteSteg: "BEGRUNNELSE", hendelse });
                }
            }}
            loading={loading}
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
    loading,
}: {
    sak: IASak;
    hendelse: GyldigNesteHendelse;
    setNesteSteg: (n: {
        nesteSteg: StatusHendelseSteg | null;
        hendelse: GyldigNesteHendelse | null;
    }) => void;
    disabled: boolean;
    variant?: ButtonProps["variant"];
    loading?: ButtonProps["loading"];
}) {
    const trengerÅFullføreKartleggingerFørst =
        useTrengerÅFullføreBehovsvurderingerFørst(
            hendelse.saksHendelsestype,
            sak,
        );

    const trengerÅFullføreSamarbeidFørst = useTrengerÅFullføreSamarbeidFørst(
        hendelse.saksHendelsestype,
        sak,
    );
    const trengerÅFullførePlanFørst = false;
    let nesteSteg: StatusHendelseSteg | null = "BEKREFT";
    if (trengerÅFullføreKartleggingerFørst) {
        nesteSteg = "FULLFØR_KARTLEGGINGER";
    } else if (trengerÅFullførePlanFørst) {
        nesteSteg = "FULLFØR_SAMARBEIDSPLAN";
    } else if (trengerÅFullføreSamarbeidFørst) {
        nesteSteg = "FULLFØR_SAMARBEID";
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
            loading={loading}
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
    loading,
}: {
    sak: IASak;
    hendelse: GyldigNesteHendelse;
    disabled: boolean;
    variant?: ButtonProps["variant"];
    onStatusEndret: (status: IASak["status"]) => void;
    loading?: ButtonProps["loading"];
}) {
    const { mutate: mutateSamarbeidshistorikk } = useHentSakshistorikk(
        sak.orgnr,
    );
    const { mutate: mutateHentSaker } = useHentSakForVirksomhet(
        sak.orgnr,
        sak.saksnummer,
    );

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
            loading={loading}
        >
            {penskrivIASakshendelsestype(hendelse.saksHendelsestype)}
        </Button>
    );
}
