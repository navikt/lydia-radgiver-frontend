import { HStack, Skeleton } from "@navikt/ds-react";
import React from "react";
import { Salesforcelenke } from "../";
import {
    useHentBrukerinformasjon,
    erSaksbehandler,
} from "../../../../api/lydia-api/bruker";
import { useHentTilstandForVirksomhetNyFlyt } from "../../../../api/lydia-api/nyFlyt";
import { useHentTeam } from "../../../../api/lydia-api/team";
import {
    IASak,
    VirksomhetIATilstandEnum,
} from "../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { VirksomhetVurderes } from "./VirksomhetVurderes";
import VirksomhetErVurdert from "./VirksomhetErVurdert";
import VirksomhetHarAktiveSamarbeid from "./VirksomhetHarAktiveSamarbeid";
import AlleSamarbeidIVirksomhetErAvsluttet from "./AlleSamarbeidIVirksomhetErAvsluttet";
import VirksomhetKlarTilVurdering from "./VirksomhetKlarTilVurdering";

export function Topplinje({
    virksomhet,
    iaSak,
    samarbeid,
}: {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    samarbeid?: IaSakProsess;
}) {
    const { data: tilstand, loading: tilstandLoading } =
        useHentTilstandForVirksomhetNyFlyt(virksomhet.orgnr);

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
    const brukerFølgerSak = følgere.some(
        (følger) => følger === brukerInformasjon?.ident,
    );
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const eierEllerFølgerSak =
        (erSaksbehandler(brukerInformasjon) && brukerFølgerSak) ||
        brukerErEierAvSak;

    if (tilstandLoading) {
        // TODO: Pen loading
        return (
            <HStack gap={"4"}>
                <Skeleton width={100} />
                <Skeleton width={60} />
                <Salesforcelenke orgnr={virksomhet.orgnr} />
            </HStack>
        );
    }

    if (
        tilstand?.tilstand ===
        VirksomhetIATilstandEnum.enum.VirksomhetKlarTilVurdering
    ) {
        return <VirksomhetKlarTilVurdering virksomhet={virksomhet} />;
    }

    if (
        tilstand?.tilstand === VirksomhetIATilstandEnum.enum.VirksomhetVurderes
    ) {
        return (
            <VirksomhetVurderes
                iaSak={iaSak!}
                eierEllerFølgerSak={eierEllerFølgerSak}
                virksomhet={virksomhet}
            />
        );
    }

    if (
        tilstand?.tilstand === VirksomhetIATilstandEnum.enum.VirksomhetErVurdert
    ) {
        return (
            <VirksomhetErVurdert
                iaSak={iaSak!}
                tilstand={tilstand}
                virksomhet={virksomhet}
            />
        );
    }

    if (
        tilstand?.tilstand ===
        VirksomhetIATilstandEnum.enum.VirksomhetHarAktiveSamarbeid
    ) {
        return (
            <VirksomhetHarAktiveSamarbeid
                iaSak={iaSak!}
                virksomhet={virksomhet}
            />
        );
    }

    if (
        tilstand?.tilstand ===
        VirksomhetIATilstandEnum.enum.AlleSamarbeidIVirksomhetErAvsluttet
    ) {
        return (
            <AlleSamarbeidIVirksomhetErAvsluttet
                iaSak={iaSak!}
                virksomhet={virksomhet}
                tilstand={tilstand}
            />
        );
    }

    console.log("ikke implementert", {
        virksomhet,
        iaSak,
        samarbeid,
        tilstand,
    });

    return "Ikke implementert";
}
