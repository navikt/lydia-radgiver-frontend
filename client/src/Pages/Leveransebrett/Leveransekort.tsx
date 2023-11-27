import { Heading } from "@navikt/ds-react";
import { EksternLenke } from "../../components/EksternLenke";
import { lokalDato } from "../../util/dato";
import { LeveranseType, Container } from "./Leveransebrettside";
import { statusTilVisbarString } from "./statusTilVisbarString";
import styled from "styled-components";

export const Leveransekort = ({ leveranse }: { leveranse: LeveranseType; }) => {
	const { orgnr, virksomhetsnavn, iaTjeneste, modul, tentativFrist, status } = leveranse;

	return (
		<Container>
			<HeaderContainer>
				<Heading size="medium">{virksomhetsnavn}</Heading>
				<EksternLenke
					key={orgnr}
					href={`/virksomhet/${orgnr}?fane=ia-tjenester`}
					target={`/virksomhet/${orgnr}?fane=ia-tjenester`}
				>
					{`Gå til IA-tjenester for virksomheten`}
				</EksternLenke>
			</HeaderContainer>
			<DataRad>
				<Datapunkt><b>IA-tjeneste:</b> {iaTjeneste.navn}</Datapunkt>
				{iaTjeneste.navn === modul.navn ? <Datapunkt /> : <Datapunkt><b>Leveranse:</b> {modul.navn}</Datapunkt>}
				<Datapunkt><b>Tentativ frist:</b> {lokalDato(new Date(tentativFrist))}</Datapunkt>
				<Datapunkt><b>Status:</b> {statusTilVisbarString(status)}</Datapunkt>
			</DataRad>
		</Container>
	);
};

const HeaderContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

const DataRad = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	flex-wrap: wrap;
	margin-top: 1rem;
`;

const Datapunkt = styled.p`
	margin-right: 1rem;
	margin-top: 0;
	margin-bottom: 0;
	width: 20rem;
`;

