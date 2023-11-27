import styled from "styled-components";
import { NavFarger } from "../../styling/farger";
import { Heading } from "@navikt/ds-react";
import { erIDev } from "../../components/Dekoratør/Dekoratør";
import { Leveransekort } from "./Leveransekort";

export type LeveranseType = {
	orgnr: number,
	virksomhetsnavn: string,
	iaTjeneste: {
		id: number,
		navn: string,
		deaktivert: boolean
	},
	modul: {
		id: number,
		iaTjeneste: number,
		navn: string,
		deaktivert: boolean
	},
	tentativFrist: string,
	status: string,
};
const dummyData: LeveranseType[] = [
	{
		orgnr: 845624253,
		virksomhetsnavn: "børres snekkersjappe",
		iaTjeneste: {
			id: 1,
			navn: "Redusere sykefravær",
			deaktivert: false
		},
		modul: {
			id: 15,
			iaTjeneste: 1,
			navn: "Redusere sykefravær",
			deaktivert: false
		},
		tentativFrist: "2023-11-29",
		status: "UNDER_ARBEID",
	},
	{
		orgnr: 56333456,
		virksomhetsnavn: "Dette er en virksomhet",
		iaTjeneste: {
			id: 1,
			navn: "Redusere sykefravær",
			deaktivert: false
		},
		modul: {
			id: 15,
			iaTjeneste: 1,
			navn: "Redusere sykefraværr",
			deaktivert: false
		},
		tentativFrist: "2023-11-29",
		status: "UNDER_ARBEID",
	},
];


export const Container = styled.div`
	padding: 2rem;
	border-radius: 0.5rem;
	margin-top: 1rem;
	background-color: ${NavFarger.white};
`;

export const Leveransebrettside = () => {
	if (!erIDev) {
		return null;
	}

	return (
		<div>
			<Heading size="large">Leveranser på saker jeg eier</Heading>
			{
				dummyData.map((leveranse, index) => {
					return (
						<Leveransekort leveranse={leveranse} key={index} />
					);
				})
			}
		</div>
	);
}
