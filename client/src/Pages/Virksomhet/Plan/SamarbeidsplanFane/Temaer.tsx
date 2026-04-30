import { Heading, HStack } from "@navikt/ds-react";
import { KeyedMutator } from "swr";
import { IaSakProsess } from "@/domenetyper/iaSakProsess";
import { Plan } from "@/domenetyper/plan";
import { VisHvisSamarbeidErÅpent } from "@/Pages/Virksomhet/Samarbeid/SamarbeidContext";
import EditTemaKnapp from "../EditTemaKnapp";
import styles from "../plan.module.scss";
import PlanGraf from "../PlanGraf";
import InnholdsBlokk from "./InnholdsBlokk";
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
                        <div className={styles.temaContainer} key={index}>
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
                                planId={samarbeidsplan.id}
                                hentPlanIgjen={hentPlanIgjen}
                                kanOppretteEllerEndrePlan={
                                    kanOppretteEllerEndrePlan
                                }
                            />
                        </div>
                    );
                })}
        </>
    );
}
