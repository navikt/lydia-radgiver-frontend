import { HStack, Skeleton } from "@navikt/ds-react";
import React from "react";
import { Salesforcelenke } from "../";
import { useHentTilstandForVirksomhetNyFlyt } from "../../../../api/lydia-api/nyFlyt";
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
import { exhaustive } from "../../../../util/exhaustive_types";
import VirksomhetErAvregistrertIBrreg from "./VirksomhetErAvregistrertIBrreg";

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
            <HStack gap={"space-16"}>
                <Skeleton width={100} />
                <Skeleton width={60} />
                <Salesforcelenke orgnr={virksomhet.orgnr} />
            </HStack>
        );
    }

    switch (tilstand?.tilstand) {
        case VirksomhetIATilstandEnum.enum.VirksomhetKlarTilVurdering:
            return <VirksomhetKlarTilVurdering virksomhet={virksomhet} />;
        case VirksomhetIATilstandEnum.enum.VirksomhetVurderes:
            return (
                <VirksomhetVurderes iaSak={iaSak!} virksomhet={virksomhet} />
            );
        case VirksomhetIATilstandEnum.enum.VirksomhetErVurdert:
            return (
                <VirksomhetErVurdert
                    iaSak={iaSak!}
                    tilstand={tilstand}
                    virksomhet={virksomhet}
                />
            );
        case VirksomhetIATilstandEnum.enum.VirksomhetHarAktiveSamarbeid:
            return (
                <VirksomhetHarAktiveSamarbeid
                    iaSak={iaSak!}
                    virksomhet={virksomhet}
                />
            );
        case VirksomhetIATilstandEnum.enum.AlleSamarbeidIVirksomhetErAvsluttet:
            return (
                <AlleSamarbeidIVirksomhetErAvsluttet
                    iaSak={iaSak!}
                    virksomhet={virksomhet}
                    tilstand={tilstand}
                />
            );
        case VirksomhetIATilstandEnum.enum.VirksomhetErAvregistrertIBrreg:
            return <VirksomhetErAvregistrertIBrreg virksomhet={virksomhet} />;
        case undefined:
            break;
        default:
            if (tilstand) exhaustive(tilstand?.tilstand);
    }

    console.log("ikke implementert", {
        virksomhet,
        iaSak,
        samarbeid,
        tilstand: tilstand,
    });

    return "Ikke implementert";
}
