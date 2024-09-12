import { BodyShort, Heading, Loader } from "@navikt/ds-react";
import React from "react";
import LeggTilTemaKnapp from "./LeggTilTemaKnapp";
import {
    useHentBrukerinformasjon,
    useHentPlan,
    useHentPlanMal,
} from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import { Temaer } from "./Temaer";
import { dispatchFeilmelding } from "../../../components/Banner/FeilmeldingBanner";
import OpprettPlanKnapp from "./OpprettPlanKnapp";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

interface Props {
    iaSak: IASak;
    samarbeid: IaSakProsess;
}

export default function PlanFane({ iaSak, samarbeid }: Props) {
    const { data: planMal, loading: lasterPlanMal } = useHentPlanMal();

    const {
        data: iaSakPlan,
        loading: lasterPlan,
        mutate: hentPlanIgjen,
        error: planFeil,
    } = useHentPlan(iaSak.orgnr, iaSak.saksnummer, samarbeid.id);

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;
    const sakErIRettStatus = ["KARTLEGGES", "VI_BISTÅR"].includes(iaSak.status);
    const kanOppretteEllerEndrePlan = brukerErEierAvSak && sakErIRettStatus;

    if (planFeil && planFeil.message !== "Fant ikke plan") {
        dispatchFeilmelding({ feilmelding: planFeil.message });
    }

    if (lasterPlan || lasterPlanMal) {
        return <Loader />;
    }

    if (iaSakPlan === undefined && planMal) {
        return (
            <>
                <Heading level="3" size="large" spacing={true}>
                    Samarbeidsplan
                </Heading>
                {!brukerErEierAvSak && (
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
                <br />
                <OpprettPlanKnapp
                    orgnummer={iaSak.orgnr}
                    saksnummer={iaSak.saksnummer}
                    samarbeid={samarbeid}
                    planMal={planMal}
                    brukerErEierAvSak={brukerErEierAvSak}
                    sakErIRettStatus={sakErIRettStatus}
                />
            </>
        );
    }

    return (
        iaSakPlan && (
            <>
                <Temaer
                    plan={iaSakPlan}
                    orgnummer={iaSak.orgnr}
                    saksnummer={iaSak.saksnummer}
                    samarbeid={samarbeid}
                    hentPlanIgjen={hentPlanIgjen}
                    kanOppretteEllerEndrePlan={kanOppretteEllerEndrePlan}
                />
                {iaSakPlan.temaer.filter((tema) => tema.planlagt).length <
                    1 && (
                    <>
                        <Heading level="3" size="large" spacing={true}>
                            Samarbeidsplan
                        </Heading>
                    </>
                )}
                <LeggTilTemaKnapp
                    orgnummer={iaSak.orgnr}
                    saksnummer={iaSak.saksnummer}
                    samarbeid={samarbeid}
                    plan={iaSakPlan}
                    hentPlanIgjen={hentPlanIgjen}
                    brukerErEierAvSak={brukerErEierAvSak}
                    sakErIRettStatus={sakErIRettStatus}
                />
            </>
        )
    );
}
