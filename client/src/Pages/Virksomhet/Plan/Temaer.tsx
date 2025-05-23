import { Plan } from "../../../domenetyper/plan";
import { Heading, HStack } from "@navikt/ds-react";
import EditTemaKnapp from "./EditTemaKnapp";
import PlanGraf from "./PlanGraf";
import InnholdsBlokk from "./InnholdsBlokk";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { KeyedMutator } from "swr";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { VisHvisSamarbeidErÅpent } from "../Samarbeid/SamarbeidContext";

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin: 1rem 0 2rem;

    ${tabInnholdStyling};
`;

export function Temaer({
    samarbeidsplan,
    orgnummer,
    saksnummer,
    samarbeid,
    hentPlanIgjen,
    kanOppretteEllerEndrePlan,
}: {
    samarbeidsplan: Plan;
    orgnummer: string;
    saksnummer: string;
    samarbeid: IaSakProsess;
    hentPlanIgjen: KeyedMutator<Plan>;
    kanOppretteEllerEndrePlan: boolean;
}) {
    return (
        <>
            {samarbeidsplan.temaer
                .filter((tema) => tema.inkludert)
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
                                <VisHvisSamarbeidErÅpent>
                                    {kanOppretteEllerEndrePlan && (
                                        <EditTemaKnapp
                                            tema={tema}
                                            orgnummer={orgnummer}
                                            saksnummer={saksnummer}
                                            samarbeid={samarbeid}
                                            hentPlanIgjen={hentPlanIgjen}
                                            samarbeidsplan={samarbeidsplan}
                                        />
                                    )}
                                </VisHvisSamarbeidErÅpent>
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
                        </Container>
                    );
                })}
        </>
    );
}
