import { BodyShort, Loader } from "@navikt/ds-react";
import React from "react";
import LeggTilTemaKnapp from "./LeggTilTemaKnapp";
import { useHentPlan, useHentPlanMal } from "../../../../api/lydia-api/plan";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "../../../../api/lydia-api/bruker";
import { IASak } from "../../../../domenetyper/domenetyper";
import { Temaer } from "./Temaer";
import { dispatchFeilmelding } from "../../../../components/Banner/dispatchFeilmelding";
import OpprettPlanKnapp from "./OpprettPlanKnapp";
import { IaSakProsess } from "../../../../domenetyper/iaSakProsess";
import { VisHvisSamarbeidErÅpent } from "../../Samarbeid/SamarbeidContext";
import { useHentTeam } from "../../../../api/lydia-api/team";
import { SamarbeidsplanHeading } from "./SamarbeidsplanHeading";

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

    const sakErIRettStatus = ["KARTLEGGES", "VI_BISTÅR"].includes(iaSak.status);
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
                        Du må være eier av saken for å opprette ny plan
                    </BodyShort>
                )}
                {!sakErIRettStatus && (
                    <BodyShort>
                        Status må være i <i>Kartlegges</i> eller{" "}
                        <i>Vi bistår</i> for å opprette ny plan
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
