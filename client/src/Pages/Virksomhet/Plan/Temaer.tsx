import { Plan } from "../../../domenetyper/plan";
import { Heading, HStack } from "@navikt/ds-react";
import EditTemaKnapp from "./EditTemaKnapp";
import PlanGraf from "./PlanGraf";
import UndertemaConfig from "./UndertemaConfig";
import VerktøyConfig from "./VerktøyConfig";
import React from "react";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";

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
    muterPlan,
}: {
    plan: Plan;
    orgnummer: string;
    saksnummer: string;
    muterPlan: () => void;
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
                            muterPlan={muterPlan}
                        />
                    </HStack>
                    <PlanGraf undertemaer={tema.undertemaer} />
                    <UndertemaConfig tema={tema} />
                    <VerktøyConfig verktøy={tema.ressurser} />
                </Container>
            );
        });
}
