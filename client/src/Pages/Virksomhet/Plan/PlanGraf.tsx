import React from "react";
import styled from "styled-components";

export type PølsegrafProps = {
	periodStart: Date,
	periodeSlutt: Date,
	pølser: PølseProps[],
};

type PølseProps = {
	pølseStart: Date,
	pølseSlutt: Date,
	tittel: string,
};

export default function PlanGraf(props: PølsegrafProps) {
	const periodStart = React.useMemo(() => new Date(props.periodStart), [props.periodStart]);
	const periodeSlutt = React.useMemo(() => new Date(props.periodeSlutt), [props.periodeSlutt]);
	const monthCols = getMonthColumns(periodStart, periodeSlutt);
	const pølser = React.useMemo(() => props.pølser.map(pølse => ({
		...pølse,
		pølseStart: new Date(pølse.pølseStart),
		pølseSlutt: new Date(pølse.pølseSlutt),
	})), [props.pølser]);



	return (
		<PølseGrid $monthCols={monthCols} $pølser={pølser}>
			<MånedsLegend startDate={periodStart} endDate={periodeSlutt} />
			{pølser.map((pølse, index) => (
				<Pølserad
					key={index}
					index={index}
					{...pølse} />
			))}
			<NåværendeDatoMarkør periodeStart={periodStart} periodeSlutt={periodeSlutt} />
		</PølseGrid>
	)
}

const PølseGrid = styled.div<{ $monthCols: string[], $pølser: PølseProps[] }>`
	display: grid;
	grid-template-columns: ${prps => "[tittel] max-content " + prps.$monthCols.map((month, index) => `[${index === 0 ? "tittel-end " : ""}col-${month}${index === prps.$monthCols.length - 1 ? " content-end" : ""}]`).join(" minmax(5rem, 1fr) ")};
	grid-template-rows: repeat(${prps => prps.$pølser.length + 1}, 1fr);
	overflow-x: auto;
	row-gap: 1rem;
`;


function NåværendeDatoMarkør({ periodeStart, periodeSlutt }: { periodeStart: Date, periodeSlutt: Date }) {
	const nå = new Date();
	if (nå < periodeStart || nå > periodeSlutt) {
		console.log("Nå er utenfor perioden");
		return null;
	}

	return (
		<div style={{
			gridColumnStart: `col-${nå.getMonth() + 1}-${nå.getFullYear()}`,
			gridColumnEnd: `col-${nå.getMonth() + 2}-${nå.getFullYear()}`,
			gridRowStart: 1,
			gridRowEnd: -1,
			display: "flex",
			justifyContent: getAlignmentInMonth(),
		}}>
			<Datomarkør />
		</div>
	);
}

function Datomarkør() {
	return (
		<DatomarkørHolder>
			<DatomarkørSirkel />
			<DatomarkørLinje />
		</DatomarkørHolder>
	)
}

const DatomarkørHolder = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	align-items: center;
	padding-top: 1.2rem;
	width: fit-content;
`;

const DatomarkørSirkel = styled.div`
	border: 5px solid var(--a-surface-danger);
	border-radius: 123px;
	width: 16px;
	height: 16px;
	background-color: var(--a-bg-default);
`;

const DatomarkørLinje = styled.div`
	background-color: var(--a-surface-inverted);
	margin-top: 1px;
	width: 2px;
	flex-grow: 1;
`;

function getAlignmentInMonth() {
	const nå = new Date();

	if (nå.getDate() < 10) {
		return "start";
	}

	if (nå.getDate() < 20) {
		return "center";
	}

	return "end";
}

function getMonthColumns(startDate: Date, endDate: Date) {
	const months = getMonthsBetweenDates(startDate, endDate);
	const monthColumns = months.map((month) => `${month.getMonth() + 1}-${month.getFullYear()}`);

	return monthColumns;
}

function getMonthsBetweenDates(date1: Date, date2: Date) {
	const monthDiff = getMonthDiff(date1, date2) + 1;
	const months = [];
	const start = date1;
	start.setDate(1);

	for (let i = 0; i < monthDiff; i++) {
		const newDate = new Date(start).setMonth(start.getMonth() + i);
		months.push(new Date(newDate));
	}

	return months;
}

function getMonthDiff(date1: Date, date2: Date) {
	let months;
	months = (date2.getFullYear() - date1.getFullYear()) * 12;
	months -= date1.getMonth();
	months += date2.getMonth();

	return months <= 0 ? 0 : months;
}

function MånedsLegend({ startDate, endDate }: { startDate: Date, endDate: Date }) {
	const months = getMonthsBetweenDates(startDate, endDate);
	months.pop();

	return (
		<>
			<TittelBakgrunn />
			{months.map((month, index) => (
				<LegendeContainer $month={month} key={index}>{month.toLocaleString('default', { month: 'short' })} {month.getFullYear().toString().substring(2)}</LegendeContainer>
			))}
		</>
	);
}

const TittelBakgrunn = styled.div`
	grid-column-start: tittel;
	grid-column-end: tittel-end;
	grid-row-start: 1;
	grid-row-end: 2;
	background-color: white;
	margin-top: -1rem;
	margin-bottom: -1rem;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	position: sticky;
	left: 0;
	padding-right: 1rem;
`;

const LegendeContainer = styled.div<{ $month: Date }>`
	grid-column-start: ${prps => `col-${prps.$month.getMonth() + 1}-${prps.$month.getFullYear()}`};
	grid-column-end: ${prps => `col-${(prps.$month.getMonth() + 1) % 12 + 1}-${prps.$month.getMonth() > 10 ? prps.$month.getFullYear() + 1 : prps.$month.getFullYear()}`};
	grid-row-start: 1;
	grid-row-end: 2;
	text-align: center;
`;

function Pølserad({ pølseStart, pølseSlutt, index, tittel }: PølseProps & { index: number }) {
	return (
		<>
			<PølseradBakgrunn $index={index} />
			<Pølsetittel $index={index}>
				{tittel}
			</Pølsetittel>
			<Pølseinnhold $start={pølseStart} $slutt={pølseSlutt} $index={index} />
		</>
	)
}

const PølseradBakgrunn = styled.div<{ $index: number }>`
	border-radius: 123px;
	grid-column-start: tittel-end;
	grid-column-end: content-end;
	grid-row-start: ${prps => prps.$index + 2};
	grid-row-end: ${prps => prps.$index + 3};
	background-color: var(--a-gray-50);
	height: 100%;
`;

const Pølsetittel = styled.div<{ $index: number }>`
	grid-column-start: tittel;
	grid-column-end: tittel-end;
	grid-row-start: ${prps => prps.$index + 2};
	grid-row-end: ${prps => prps.$index + 3};
	padding-right: 1rem;
	position: sticky;
	left: 0;
	background-color: white;
	margin-top: -1rem;
	margin-bottom: -1rem;
	display: flex;
	justify-content: flex-start;
	align-items: center;
`;

const Pølseinnhold = styled.div<{ $index: number, $start: Date, $slutt: Date }>`
	background-color: ${prps => `var(--a-data-surface-${(prps.$index % 6) + 1}-subtle)`};
	border: ${prps => `2px solid var(--a-data-border-${(prps.$index % 6) + 1})`};
	border-radius: 123px;
	grid-column-start: ${prps => `col-${prps.$start.getMonth() + 1}-${prps.$start.getFullYear()}`};
	grid-column-end: ${prps => `col-${prps.$slutt.getMonth() + 1}-${prps.$slutt.getFullYear()}`};
	grid-row-start: ${prps => prps.$index + 2};
	grid-row-end: ${prps => prps.$index + 3};
	height: 100%;
`;