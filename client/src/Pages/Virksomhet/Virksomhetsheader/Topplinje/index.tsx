import { HStack, Skeleton } from "@navikt/ds-react";
import React from "react";
import { IASak, VirksomhetIATilstandEnum } from "@/domenetyper/domenetyper";
import { useHentTilstandForVirksomhetNyFlyt } from "@features/sak/api/nyFlyt";
import { IaSakProsess } from "@features/sak/types/iaSakProsess";
import { Virksomhet } from "@features/virksomhet/types/virksomhet";
import { Salesforcelenke } from "../";
import AlleSamarbeidIVirksomhetErAvsluttet from "./AlleSamarbeidIVirksomhetErAvsluttet";
import VirksomhetErVurdert from "./VirksomhetErVurdert";
import VirksomhetHarAktiveSamarbeid from "./VirksomhetHarAktiveSamarbeid";
import VirksomhetKlarTilVurdering from "./VirksomhetKlarTilVurdering";
import { VirksomhetVurderes } from "./VirksomhetVurderes";

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
        return <VirksomhetVurderes iaSak={iaSak!} virksomhet={virksomhet} />;
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

    return "Ikke implementert";
}
