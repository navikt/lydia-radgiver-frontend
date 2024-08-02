import { Timeline } from "@navikt/ds-react";
import React from "react";
import { PlanUndertema } from "../../../domenetyper/plan";

export type PølsegrafProps = {
    undertemaer: PlanUndertema[];
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

    const fargekoder: (
        | "success"
        | "warning"
        | "danger"
        | "info"
        | "neutral"
    )[] = ["success", "warning", "danger", "info"];

    return (
        <>
            <Timeline key={`${earliestStart}-${latestSlutt}`}>
                <Timeline.Pin date={new Date()} />
                {undertemaer.map((pølse) => (
                    <Timeline.Row label={pølse.navn} key={pølse.navn}>
                        <Timeline.Period
                            start={new Date(pølse.start)}
                            end={new Date(pølse.slutt)}
                            status={
                                fargekoder[(pølse.id - 1) % fargekoder.length]
                            }
                            statusLabel={`${pølse.navn}: ${pølse.status}:`}
                        />
                    </Timeline.Row>
                ))}
            </Timeline>
        </>
    );
}
