import { Plan } from "../../../domenetyper/plan";
import { Heading, HStack } from "@navikt/ds-react";
import EditTemaKnapp from "./EditTemaKnapp";
import PlanGraf from "./PlanGraf";
import InnholdsBlokk from "./InnholdsBlokk";
import React from "react";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { KeyedMutator } from "swr";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin: 1rem 0 2rem;

    ${tabInnholdStyling};
`;
export function Temaer({
    plan,
    orgnummer,
    saksnummer,
    samarbeid,
    hentPlanIgjen,
    kanOppretteEllerEndrePlan,
}: {
    plan: Plan;
    orgnummer: string;
    saksnummer: string;
    samarbeid: IaSakProsess;
    hentPlanIgjen: KeyedMutator<Plan>;
    kanOppretteEllerEndrePlan: boolean;
}) {
    return (
        <>
            {plan.temaer
                .filter((tema) => tema.planlagt)
                .sort((a, b) => {
                    return a.id - b.id;
                })
                .map((tema, index) => {
                    return (
                        <Container key={index}>
                            <HStack justify="space-between">
                                <Heading level="3" size="medium" spacing={true}>
                                    {tema.navn}
                                </Heading>
                                {kanOppretteEllerEndrePlan && (
                                    <EditTemaKnapp
                                        tema={tema}
                                        orgnummer={orgnummer}
                                        saksnummer={saksnummer}
                                        samarbeid={samarbeid}
                                        hentPlanIgjen={hentPlanIgjen}
                                    />
                                )}
                            </HStack>
                            <PlanGraf undertemaer={tema.undertemaer} />
                            <InnholdsBlokk
                                tema={tema}
                                orgnummer={orgnummer}
                                saksnummer={saksnummer}
                                samarbeid={samarbeid}
                                hentPlanIgjen={hentPlanIgjen}
                                kanOppretteEllerEndrePlan={
                                    kanOppretteEllerEndrePlan
                                }
                            />
                            {/*<VerktøyConfig verktøy={tema.ressurser} />*/}
                        </Container>
                    );
                })}
        </>
    );
}
