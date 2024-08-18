import { BodyShort, Button, Heading, Loader } from "@navikt/ds-react";
import React from "react";
import LeggTilTemaKnapp from "./LeggTilTemaKnapp";
import {
    nyPlanPåSak,
    useHentBrukerinformasjon,
    useHentIaProsesser,
    useHentPlan,
} from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import { Temaer } from "./Temaer";
import { dispatchFeilmelding } from "../../../components/Banner/FeilmeldingBanner";
import styled from "styled-components";
import { PlusIcon } from "@navikt/aksel-icons";

interface Props {
    iaSak: IASak;
}

const FremhevetTekst = styled.span`
    font-style: italic;
`;

export default function PlanFane({ iaSak }: Props) {
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

    const opprettPlan = () => {
        nyPlanPåSak(iaSak.orgnr, iaSak.saksnummer).then(() => {
            hentPlanIgjen();
            hentProsesserIgjen();
        });
    };

    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;
    const sakErIRettStatus = ["KARTLEGGES", "VI_BISTÅR"].includes(iaSak.status);
    const kanOppretteEllerEndrePlan = brukerErEierAvSak && sakErIRettStatus;

    if (planFeil && planFeil.message !== "Fant ikke plan") {
        dispatchFeilmelding({ feilmelding: planFeil.message });
    }

    if (lasterPlan) {
        return <Loader />;
    }

    if (iaSakPlan === undefined) {
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
                <Button
                    size="medium"
                    iconPosition="left"
                    variant="primary"
                    onClick={opprettPlan}
                    icon={<PlusIcon />}
                    disabled={!kanOppretteEllerEndrePlan}
                >
                    Opprett plan
                </Button>
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
                    temaer={iaSakPlan.temaer}
                    hentPlanIgjen={hentPlanIgjen}
                    brukerErEierAvSak={brukerErEierAvSak}
                    sakErIRettStatus={sakErIRettStatus}
                />
            </>
        )
    );
}
