import { Timeline } from "@navikt/ds-react";
import React from "react";
import { PlanInnhold } from "../../../domenetyper/plan";

export type PølsegrafProps = {
    undertemaer: PlanInnhold[];
    hidePin?: boolean;
};

export default function PlanGraf(props: PølsegrafProps) {
    const undertemaer = React.useMemo(
        () =>
            props.undertemaer
                .filter((pølse) => pølse.sluttDato && pølse.startDato)
                .map((pølse) => {
                    const slutt = new Date(pølse.sluttDato ?? "");
                    slutt.setDate(slutt.getDate() - 1);

                    return {
                        ...pølse,
                        start: new Date(pølse.startDato ?? ""),
                        slutt,
                    };
                }),
        [props.undertemaer],
    );
    const iDag = new Date();

    const { earliestStart, latestSlutt } = React.useMemo(() => {
        const undertemaStartOgSlutt = undertemaer.reduce(
            (acc, pølse) => {
                const start = new Date(pølse.start);
                const slutt = new Date(pølse.slutt);
                if (acc.earliestStart > start) {
                    acc.earliestStart = start;
                }
                if (acc.latestSlutt < slutt) {
                    acc.latestSlutt = slutt;
                }
                return acc;
            },
            {
                earliestStart: new Date(8640000000000000),
                latestSlutt: new Date(-8640000000000000),
            },
        );

        // Vis opptil en uke før eller etter perioden, dersom det tar med dagens dato. Ellers vis +-1 dag.
        const ukeFørStart = new Date(undertemaStartOgSlutt.earliestStart);
        ukeFørStart.setDate(ukeFørStart.getDate() - 7);
        const dagFørStart = new Date(undertemaStartOgSlutt.earliestStart);
        dagFørStart.setDate(dagFørStart.getDate() - 1);

        const ukeEtterStart = new Date(undertemaStartOgSlutt.latestSlutt);
        ukeEtterStart.setDate(ukeEtterStart.getDate() - 7);
        const dagEtterStart = new Date(undertemaStartOgSlutt.latestSlutt);
        dagEtterStart.setDate(dagEtterStart.getDate() + 1);

        return {
            earliestStart:
                ukeFørStart < iDag && undertemaStartOgSlutt.earliestStart > iDag
                    ? ukeFørStart
                    : dagFørStart,
            latestSlutt:
                ukeEtterStart > iDag && undertemaStartOgSlutt.latestSlutt < iDag
                    ? ukeEtterStart
                    : dagEtterStart,
        };
    }, [undertemaer]);

    if (undertemaer.length === 0) {
        return null;
    }
    return (
        <>
            <Timeline startDate={earliestStart} endDate={latestSlutt}>
                {props.hidePin ||
                iDag < earliestStart ||
                iDag > latestSlutt ? undefined : (
                    <Timeline.Pin date={new Date()} />
                )}
                {undertemaer
                    .sort((a, b) => {
                        return a.id - b.id;
                    })
                    .map((undertema) => (
                        <Timeline.Row
                            label={undertema.navn}
                            key={undertema.navn}
                        >
                            <Timeline.Period
                                start={new Date(undertema.start)}
                                end={new Date(undertema.slutt)}
                                status={timelineColorFromStatus(
                                    undertema.status,
                                )}
                                statusLabel={`${undertema.navn}: ${undertema.status}:`}
                            />
                        </Timeline.Row>
                    ))}
            </Timeline>
        </>
    );
}

function timelineColorFromStatus(status: string | null) {
    switch (status) {
        case "PÅGÅR":
            return "info";
        case "FULLFØRT":
            return "success";
        case "AVBRUTT":
            return "danger";
        case "PLANLAGT":
            return "warning";

        default:
            return "neutral";
    }
}
