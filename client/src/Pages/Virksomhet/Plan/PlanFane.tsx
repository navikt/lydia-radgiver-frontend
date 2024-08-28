import { BodyShort, Heading, Loader } from "@navikt/ds-react";
import React from "react";
import LeggTilTemaKnapp from "./LeggTilTemaKnapp";
import {
    useHentBrukerinformasjon,
    useHentIaProsesser,
    useHentPlan,
    useHentPlanMal,
} from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import { Temaer } from "./Temaer";
import { dispatchFeilmelding } from "../../../components/Banner/FeilmeldingBanner";
import styled from "styled-components";
import OpprettPlanKnapp from "./OpprettPlanKnapp";

interface Props {
    iaSak: IASak;
}

const FremhevetTekst = styled.span`
    font-style: italic;
`;

export default function PlanFane({ iaSak }: Props) {
    const { data: planMal, loading: lasterPlanMal } = useHentPlanMal();

    const {
        data: iaSakPlan,
        loading: lasterPlan,
        mutate: hentPlanIgjen,
        error: planFeil,
    } = useHentPlan(iaSak.orgnr, iaSak.saksnummer);

    const { mutate: hentProsesserIgjen } = useHentIaProsesser(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

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
                        Status må være i{" "}
                        <FremhevetTekst>Kartlegges</FremhevetTekst> eller{" "}
                        <FremhevetTekst>Vi bistår</FremhevetTekst> for å
                        opprette ny plan
                    </BodyShort>
                )}
                <br />
                <OpprettPlanKnapp
                    orgnummer={iaSak.orgnr}
                    saksnummer={iaSak.saksnummer}
                    planMal={planMal}
                    hentPlanIgjen={hentPlanIgjen}
                    hentProsesserIgjen={hentProsesserIgjen}
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
                    plan={iaSakPlan}
                    hentPlanIgjen={hentPlanIgjen}
                    brukerErEierAvSak={brukerErEierAvSak}
                    sakErIRettStatus={sakErIRettStatus}
                />
            </>
        )
    );
}
