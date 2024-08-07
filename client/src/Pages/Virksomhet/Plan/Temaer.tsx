import { Plan } from "../../../domenetyper/plan";
import { Heading, HStack } from "@navikt/ds-react";
import EditTemaKnapp from "./EditTemaKnapp";
import PlanGraf from "./PlanGraf";
import UndertemaConfig from "./UndertemaConfig";
import VerktøyConfig from "./VerktøyConfig";
import React from "react";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { KeyedMutator } from "swr";

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin-bottom: 2rem;

    ${tabInnholdStyling};
`;
export function Temaer({
    plan,
    orgnummer,
    saksnummer,
    hentPlanIgjen,
}: {
    plan: Plan;
    orgnummer: string;
    saksnummer: string;
    hentPlanIgjen: KeyedMutator<Plan>;
}) {
    return plan.temaer
        .filter((tema) => tema.planlagt)
        .map((tema, index) => {
            return (
                <Container key={index}>
                    <HStack justify="space-between">
                        <Heading level="3" size="medium" spacing={true}>
                            {tema.navn}
                        </Heading>
                        <EditTemaKnapp
                            tema={tema}
                            orgnummer={orgnummer}
                            saksnummer={saksnummer}
                            hentPlanIgjen={hentPlanIgjen}
                        />
                    </HStack>
                    <PlanGraf undertemaer={tema.undertemaer} />
                    <UndertemaConfig
                        tema={tema}
                        orgnummer={orgnummer}
                        saksnummer={saksnummer}
                        hentPlanIgjen={hentPlanIgjen}
                    />
                    <VerktøyConfig verktøy={tema.ressurser} />
                </Container>
            );
        });
}
