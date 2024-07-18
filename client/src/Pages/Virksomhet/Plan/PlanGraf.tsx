import { Timeline } from "@navikt/ds-react";
import React from "react";
import { Arbeidsperiode } from "./UndertemaConfig";

export type PølsegrafProps = {
	pølser: Arbeidsperiode[],
};

export default function PlanGraf(props: PølsegrafProps) {
	const pølser = React.useMemo(() => props.pølser.filter((pølse) => pølse.slutt && pølse.start).map((pølse) => {
		const slutt = new Date(pølse.slutt ?? "");
		slutt.setDate(slutt.getDate() - 1);

		return ({
			...pølse,
			start: new Date(pølse.start ?? ""),
			slutt,
		})
	}), [props.pølser]);

	const { earliestStart, latestSlutt } = React.useMemo(() => pølser.reduce((acc, pølse) => {
		const start = new Date(pølse.start);
		const slutt = new Date(pølse.slutt);
		if (acc.earliestStart > start) {
			acc.earliestStart = start;
		}
		if (acc.latestSlutt < slutt) {
			acc.latestSlutt = slutt;
		}
		return acc;
	}, { earliestStart: new Date(8640000000000000), latestSlutt: new Date(-8640000000000000) }), [pølser]);

	if (pølser.length === 0) {
		return null;
	}

	return (
		<>
			<Timeline key={`${earliestStart}-${latestSlutt}`}>
				<Timeline.Pin date={new Date()} />
				{
					pølser.map((pølse) => (
						<Timeline.Row label={pølse.tittel} key={pølse.tittel}>
							<Timeline.Period
								start={new Date(pølse.start)}
								end={new Date(pølse.slutt)}
								status={pølse.statusfarge}
								statusLabel={`${pølse.tittel}: ${pølse.status}:`}
							/>
						</Timeline.Row>
					))
				}
			</Timeline>
		</>
	)
}