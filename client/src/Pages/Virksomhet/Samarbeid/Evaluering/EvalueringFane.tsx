import { BodyShort, Heading } from "@navikt/ds-react";
import React from "react";
import { VIS_EVALUERING } from "../../../../util/feature-toggles";
import { IASak } from "../../../../domenetyper/domenetyper";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "../../../../api/lydia-api/bruker";
import { SpørreundersøkelseHeading } from "../../../../components/Spørreundersøkelse/SpørreundersøkelseHeading";
import { SpørreundersøkelseHjelpetekst } from "../../../../components/Spørreundersøkelse/SpørreundersøkelseHjelpetekst";
import { Evaluering } from "./Evaluering";
import { useHentSamarbeid } from "../../../../api/lydia-api/spørreundersøkelse";
import { useHentPlan } from "../../../../api/lydia-api/plan";
import { useHentTeam } from "../../../../api/lydia-api/team";

export default function EvalueringFane({
    iaSak,
    gjeldendeSamarbeid,
}: {
    iaSak: IASak;
    gjeldendeSamarbeid: IaSakProsess;
}) {
    if (!VIS_EVALUERING) {
        return (
            <>
                <Heading level="3" size="large" spacing={true}>
                    Evaluering
                </Heading>
                <BodyShort>Her kommer det evaluering</BodyShort>
            </>
        );
    }

    return (
        <NyEvalueringFane
            iaSak={iaSak}
            gjeldendeSamarbeid={gjeldendeSamarbeid}
        />
    );
}

function NyEvalueringFane({
    iaSak,
    gjeldendeSamarbeid,
}: {
    iaSak: IASak;
    gjeldendeSamarbeid: IaSakProsess;
}) {
    const { data: alleSamarbeid } = useHentSamarbeid(
        iaSak.orgnr,
        iaSak.saksnummer,
    );
    const { data: samarbeidsplan } = useHentPlan(
        iaSak.orgnr,
        iaSak.saksnummer,
        gjeldendeSamarbeid.id,
    );
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
    const brukerFølgerSak = følgere.some(
        (følger) => følger === brukerInformasjon?.ident,
    );
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const kanEndreSpørreundersøkelser =
        (erSaksbehandler(brukerInformasjon) && brukerFølgerSak) ||
        brukerErEierAvSak;

    const sakErIRettStatus = ["VI_BISTÅR"].includes(iaSak.status);

    if (alleSamarbeid === undefined || alleSamarbeid.length === 0) {
        return (
            <>
                <SpørreundersøkelseHeading
                    type="Evaluering"
                    samarbeid={gjeldendeSamarbeid}
                />
                <SpørreundersøkelseHjelpetekst
                    type="Evaluering"
                    kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
                    sakErIRettStatus={sakErIRettStatus}
                />
            </>
        );
    }

    return (
        <>
            <SpørreundersøkelseHeading
                type="Evaluering"
                samarbeid={gjeldendeSamarbeid || alleSamarbeid[0]}
            />
            <SpørreundersøkelseHjelpetekst
                type="Evaluering"
                kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
                sakErIRettStatus={sakErIRettStatus}
                harPlan={samarbeidsplan !== undefined}
            />
            <Evaluering
                brukerRolle={brukerInformasjon?.rolle}
                samarbeid={gjeldendeSamarbeid || alleSamarbeid[0]}
                kanEndreSpørreundersøkelser={kanEndreSpørreundersøkelser}
                sakErIRettStatus={sakErIRettStatus}
                iaSak={iaSak}
                harPlan={samarbeidsplan !== undefined}
            />
        </>
    );
}
