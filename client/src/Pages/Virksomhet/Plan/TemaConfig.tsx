import { Accordion, BodyLong, Heading, MonthPicker, Select, TimelinePeriodProps } from "@navikt/ds-react";
import React from "react";
import styled from "styled-components";

export type Arbeidsperiodestatus = "Fullført" | "Pågår" | "Planlagt";
export type Verktøylenke = {
	tittel: string;
	url: string;
};

export type Arbeidsperiode = {
	start: Date;
	slutt: Date;
	tittel: string;
	status: Arbeidsperiodestatus;
	statusfarge: TimelinePeriodProps["status"];
};

export type Temainnhold = {
	tittel: string;
	undertema: Arbeidsperiode[];
	verktøy: Verktøylenke[];
};

const StyledAccordion = styled(Accordion)`
	width: 100%;
	display: grid;
	grid-template-columns: min-content 1fr 1fr 8rem;
`;
const StyledAccordionItem = styled(Accordion.Item)`
	grid-column: 1/5;
	display: grid;
	grid-template-columns: subgrid;
`;
const StyledAccordionHeader = styled(Accordion.Header)`
	grid-column: 1/5;
	display: grid;
	grid-template-columns: subgrid;
	.navds-accordion__header-content {
		grid-column: 2/5;
		display: grid;
		grid-template-columns: subgrid;

	}
`;
const StyledAccordionContent = styled(Accordion.Content)`
	grid-column: 1/5;
`;

const LabelRad = styled.div`
	grid-column: 1/5;
	display: grid;
	grid-template-columns: subgrid;
	padding-bottom: 0.5rem;
	font-weight: 600;
`;

const TemaLabel = styled.span`
	grid-column: 2/3;
`;
const PeriodeLabel = styled.span`
	grid-column: 3/4;
`;
const StatusLabel = styled.span`
	grid-column: 4/5;
`;

export default function TemaConfig({ tema, setTema }: { tema: Temainnhold, setTema: (tema: Temainnhold) => void }) {
	return (
		<StyledAccordion>
			<LabelRad>
				<TemaLabel>Tema</TemaLabel>
				<PeriodeLabel>Periode</PeriodeLabel>
				<StatusLabel>Status</StatusLabel>
			</LabelRad>
			{
				tema.undertema.map((undertema, index) => (
					<Temalinje
						key={index}
						undertema={undertema}
						setUndertema={(p: Arbeidsperiode) => {
							const nyVerdi = { ...tema };
							nyVerdi.undertema = [...tema.undertema];
							nyVerdi.undertema[index] = p;

							setTema(nyVerdi);
						}} />))
			}
		</StyledAccordion>
	);
}

function Temalinje({ undertema, setUndertema }: { undertema: Arbeidsperiode, setUndertema: (p: Arbeidsperiode) => void }) {
	const setStart = (d: Date) => setUndertema({ ...undertema, start: d })
	const setSlutt = (d: Date) => setUndertema({ ...undertema, slutt: d })
	return (
		<StyledAccordionItem>
			<TemalinjeHeader undertema={undertema} setUndertema={setUndertema} />
			<StyledAccordionContent>
				<span style={{ display: "flex", gridColumn: "2/4" }}>
					<MonthPicker selected={undertema.start} defaultSelected={undertema.start} onMonthSelect={(m) => {
						if (m) {
							setStart(m);
						}
					}}>
						<MonthPicker.Input hideLabel onChange={() => null} label="Start" value={`${undertema.start.toLocaleString('default', { month: 'short' })} ${undertema.start.getFullYear()}`} />
					</MonthPicker>
					{" - "}
					<MonthPicker selected={undertema.slutt} onMonthSelect={(m) => {
						if (m) {
							setSlutt(m);
						}
					}}>
						<MonthPicker.Input hideLabel onChange={() => null} label="Slutt" value={`${undertema.slutt.toLocaleString('default', { month: 'short' })} ${undertema.slutt.getFullYear()}`} />
					</MonthPicker>
				</span>
				<Heading level="4" size="small">Mål: Øke kompetansen på hvordan gjennomføre gode oppfølgingssamtaler, både gjennom teori og praksis.</Heading>
				<BodyLong>
					God dialog mellom leder og ansatt er sentralt i god sykefraværsoppfølging. En oppfølgingssamtale er en godt forberedt og personlig samtale mellom leder og medarbeider. Det er lovvpålagt å lage oppfølgingsplan for alle sykemeldte, følge opp og dokumentere samtaler.
				</BodyLong>
			</StyledAccordionContent>
		</StyledAccordionItem>
	)
}

function TemalinjeHeader({ undertema, setUndertema }: { undertema: Arbeidsperiode, setUndertema: (p: Arbeidsperiode) => void }) {
	return (
		<StyledAccordionHeader>
			<span>{undertema.tittel}</span>
			<TemalinjeHeaderPeriode
				start={undertema.start}
				slutt={undertema.slutt}
			/>
			<TemalinjeHeaderStatus status={undertema.status} setStatus={(s) => setUndertema({ ...undertema, status: s })} />
		</StyledAccordionHeader>
	);
}

function TemalinjeHeaderPeriode({ start, slutt }: { start: Date; slutt: Date; }) {
	return (
		<><PrettyDate date={start} /> - <PrettyDate date={slutt} /></>
	);
}

function PrettyDate({ date, visNesteMåned = false }: { date: Date, visNesteMåned?: boolean }) {
	const visningsdato = React.useMemo(() => {
		const nyDato = new Date(date);
		if (visNesteMåned) {
			nyDato.setDate(nyDato.getDate() - 1);
		}

		return nyDato;
	}, [visNesteMåned, date]);

	return `${visningsdato.toLocaleString('default', { month: 'short' })} ${visningsdato.getFullYear()}`;
}

function TemalinjeHeaderStatus({ status, setStatus }: { status: Arbeidsperiodestatus; setStatus: (s: Arbeidsperiodestatus) => void }) {
	return (<span>
		<Select label="Status" size="small" hideLabel value={status} onClick={(e) => e.stopPropagation()} onChange={(e) => {
			e.stopPropagation();
			setStatus(e.target.value as Arbeidsperiodestatus);
		}}>
			<option value="Fullført">Fullført</option>
			<option value="Pågår">Pågår</option>
			<option value="Planlagt">Planlagt</option>
		</Select>
	</span>);
}