import { HStack, Skeleton, Button, Tooltip } from "@navikt/ds-react";
import React, { useState } from "react";
import { Salesforcelenke } from "../";
import {
    useHentBrukerinformasjon,
    erSaksbehandler,
} from "../../../../../api/lydia-api/bruker";
import {
    useHentTilstandForVirksomhetNyFlyt,
    vurderSakNyFlyt,
} from "../../../../../api/lydia-api/nyFlyt";
import { useHentTeam } from "../../../../../api/lydia-api/team";
import {
    IASak,
    VirksomhetIATilstandEnum,
} from "../../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../../domenetyper/iaSakProsess";
import { Virksomhet } from "../../../../../domenetyper/virksomhet";
import { useOversiktMutate } from "../../../Debugside/Oversikt";
import { VirksomhetVurderes } from "./VirksomhetVurderes";
import VirksomhetErVurdert from "./VirksomhetErVurdert";

export function Topplinje({
    virksomhet,
    iaSak,
    samarbeid,
}: {
    virksomhet: Virksomhet;
    iaSak?: IASak;
    samarbeid?: IaSakProsess;
}) {
    const mutate = useOversiktMutate(virksomhet.orgnr);
    const [error, setError] = useState<string | null>(null);
    const [lasterHandling, setLasterHandling] = useState(false);
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

    if (error) {
        return <HStack gap="4">ERROR: {error}</HStack>;
    }

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
        const handleSubmit = async () => {
            setError(null);
            setLasterHandling(true);
            try {
                await vurderSakNyFlyt(virksomhet.orgnr);
                setLasterHandling(false);
                mutate();
            } catch (e) {
                setError(e instanceof Error ? e.message : String(e));
                setLasterHandling(false);
            }
        };
        return (
            <HStack gap={"4"}>
                {brukerInformasjon?.rolle === "Superbruker" ? (
                    <Button
                        onClick={handleSubmit}
                        disabled={lasterHandling}
                        loading={lasterHandling}
                        size="small"
                    >
                        Vurder virksomheten
                    </Button>
                ) : (
                    <Tooltip content="Du må ha rollen som superbruker for å vurdere">
                        <Button disabled size="small">
                            Vurder virksomheten
                        </Button>
                    </Tooltip>
                )}
                <Salesforcelenke orgnr={virksomhet.orgnr} />
            </HStack>
        );
    }

    if (
        tilstand?.tilstand === VirksomhetIATilstandEnum.enum.VirksomhetVurderes
    ) {
        return (
            <VirksomhetVurderes
                iaSak={iaSak!}
                eierEllerFølgerSak={eierEllerFølgerSak}
                lasterHandling={lasterHandling}
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

    console.log("ikke implementert", {
        virksomhet,
        iaSak,
        samarbeid,
        tilstand,
    });

    return "Ikke implementert";
}
