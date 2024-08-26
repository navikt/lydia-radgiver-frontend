import { Timeline } from "@navikt/ds-react";
import React from "react";
import { PlanInnhold } from "../../../domenetyper/plan";

export type PølsegrafProps = {
    undertemaer: PlanInnhold[];
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

    const { earliestStart, latestSlutt } = React.useMemo(
        () =>
            undertemaer.reduce(
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
            ),
        [undertemaer],
    );

    if (undertemaer.length === 0) {
        return null;
    }
    return (
        <>
            <Timeline key={`${earliestStart}-${latestSlutt}`}>
                <Timeline.Pin date={new Date()} />
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
                                status={
                                    undertema.status === "PÅGÅR"
                                        ? "info"
                                        : undertema.status === "FULLFØRT"
                                          ? "success"
                                          : "neutral"
                                }
                                statusLabel={`${undertema.navn}: ${undertema.status}:`}
                            />
                        </Timeline.Row>
                    ))}
            </Timeline>
        </>
    );
}
