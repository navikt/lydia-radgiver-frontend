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
import { tabInnholdStyling } from "../../../styling/containere";

interface Props {
    iaSak: IASak;
}

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 3rem;

    ${tabInnholdStyling};
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
    const kanOppretteEllerEndrePlan =
        brukerErEierAvSak && ["KARTLEGGES", "VI_BISTÅR"].includes(iaSak.status);

    if (planFeil && planFeil.message !== "Fant ikke plan") {
        dispatchFeilmelding({ feilmelding: planFeil.message });
    }

    if (lasterPlan) {
        return <Loader />;
    }

    if (iaSakPlan === undefined) {
        return (
            <Container>
                <div>
                    <Heading level="3" size="large" spacing={true}>
                        Samarbeidsplan
                    </Heading>
                    <BodyShort>
                        Denne saken har ikke allerede en plan.
                    </BodyShort>
                    {kanOppretteEllerEndrePlan ? (
                        <>
                            <br />
                            <Button
                                size="small"
                                iconPosition="right"
                                variant="secondary"
                                onClick={opprettPlan}
                            >
                                Opprett plan
                            </Button>
                        </>
                    ) : (
                        <>
                            <br />
                            <BodyShort>
                                For å kunne opprette en plan må du være eier av
                                saken og saken må være i status Kartlegges eller
                                Vi Bistår
                            </BodyShort>
                        </>
                    )}
                </div>
            </Container>
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
                    <Container>
                        <div>
                            <Heading level="3" size="large" spacing={true}>
                                Samarbeidsplan
                            </Heading>
                            <BodyShort>
                                Denne saken har en tom plan, trykk på Rediger
                                plan under for å kunne legge til temaer.
                            </BodyShort>
                            {!kanOppretteEllerEndrePlan && (
                                <>
                                    <br />
                                    <BodyShort>
                                        For å kunne redigere planen må du være
                                        eier av saken og saken må være i status
                                        Kartlegges eller Vi Bistår
                                    </BodyShort>
                                </>
                            )}
                        </div>
                    </Container>
                )}
                <br />
                {kanOppretteEllerEndrePlan && (
                    <LeggTilTemaKnapp
                        orgnummer={iaSak.orgnr}
                        saksnummer={iaSak.saksnummer}
                        temaer={iaSakPlan.temaer}
                        hentPlanIgjen={hentPlanIgjen}
                    />
                )}
            </>
        )
    );
}
