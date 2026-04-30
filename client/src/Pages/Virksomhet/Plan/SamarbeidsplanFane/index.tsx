import { BodyShort, Loader } from "@navikt/ds-react";
import React from "react";
import { dispatchFeilmelding } from "@/components/Banner/dispatchFeilmelding";
import { IASak } from "@/domenetyper/domenetyper";
import { VisHvisSamarbeidErÅpent } from "@/Pages/Virksomhet/Samarbeid/SamarbeidContext";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "@features/bruker/api/bruker";
import { useHentTeam } from "@features/bruker/api/team";
import { useHentPlan, useHentPlanMal } from "@features/plan/api/plan";
import { IaSakProsess } from "@features/sak/types/iaSakProsess";
import LeggTilTemaKnapp from "./LeggTilTemaKnapp";
import OpprettPlanKnapp from "./OpprettPlanKnapp";
import { SamarbeidsplanHeading } from "./SamarbeidsplanHeading";
import { Temaer } from "./Temaer";

export default function SamarbeidsplanFane({
    iaSak,
    samarbeid,
}: {
    iaSak: IASak;
    samarbeid: IaSakProsess;
}) {
    const { data: planMal, loading: lasterPlanMal } = useHentPlanMal();

    const {
        data: samarbeidsplan,
        loading: lasterPlan,
        mutate: hentPlanIgjen,
        error: planFeil,
    } = useHentPlan(iaSak.orgnr, iaSak.saksnummer, samarbeid.id);

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
    const brukerFølgerSak = følgere.some(
        (følger) => følger === brukerInformasjon?.ident,
    );
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const eierEllerFølgerSak =
        (erSaksbehandler(brukerInformasjon) && brukerFølgerSak) ||
        brukerErEierAvSak;

    const sakErIRettStatus = ["KARTLEGGES", "VI_BISTÅR", "AKTIV"].includes(
        iaSak.status,
    );
    const kanOppretteEllerEndrePlan = eierEllerFølgerSak && sakErIRettStatus;
    const erLesebruker = brukerInformasjon?.rolle === "Lesetilgang";

    if (planFeil && planFeil.message !== "Fant ikke plan") {
        dispatchFeilmelding({ feilmelding: planFeil.message });
    }

    if (lasterPlan || lasterPlanMal) {
        return <Loader />;
    }

    if (samarbeidsplan === undefined && planMal) {
        if (erLesebruker) {
            return <BodyShort>Ingen samarbeidsplan er opprettet</BodyShort>;
        }

        return (
            <>
                {samarbeid.status === "AKTIV" && (
                    <OpprettPlanKnapp
                        orgnummer={iaSak.orgnr}
                        saksnummer={iaSak.saksnummer}
                        samarbeid={samarbeid}
                        planMal={planMal}
                        kanEndrePlan={eierEllerFølgerSak}
                        sakErIRettStatus={sakErIRettStatus}
                    />
                )}
                {!eierEllerFølgerSak && (
                    <BodyShort>
                        Du må være eier eller følger for å opprette ny plan
                    </BodyShort>
                )}
            </>
        );
    }

    return (
        samarbeidsplan && (
            <>
                <SamarbeidsplanHeading
                    iaSak={iaSak}
                    samarbeid={samarbeid}
                    samarbeidsplan={samarbeidsplan}
                />
                <Temaer
                    samarbeidsplan={samarbeidsplan}
                    orgnummer={iaSak.orgnr}
                    saksnummer={iaSak.saksnummer}
                    samarbeid={samarbeid}
                    hentPlanIgjen={hentPlanIgjen}
                    kanOppretteEllerEndrePlan={kanOppretteEllerEndrePlan}
                />
                <VisHvisSamarbeidErÅpent>
                    <LeggTilTemaKnapp
                        orgnummer={iaSak.orgnr}
                        saksnummer={iaSak.saksnummer}
                        samarbeid={samarbeid}
                        samarbeidsplan={samarbeidsplan}
                        hentPlanIgjen={hentPlanIgjen}
                        kanEndrePlan={eierEllerFølgerSak}
                        sakErIRettStatus={sakErIRettStatus}
                    />
                </VisHvisSamarbeidErÅpent>
            </>
        )
    );
}
