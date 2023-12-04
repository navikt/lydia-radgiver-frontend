import { Heading } from "@navikt/ds-react";
import styled from "styled-components";
import { EksternLenke } from "../../components/EksternLenke";
import { lokalDato } from "../../util/dato";
import { MineIATjenester } from "../../domenetyper/leveranse";
import { hvitBoksMedSkygge } from "../../styling/containere";

export const Container = styled.div`
	padding: 2rem;
	margin-top: 1rem;
    ${hvitBoksMedSkygge}
`;

const HeaderContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

const Detaljer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	flex-wrap: wrap;
	margin-top: 1rem;
`;

const Datapunkt = styled.p`
	margin-right: 1rem;
	margin-top: 0;
	margin-bottom: 0;
`;

interface Props {
    iaTjeneste: MineIATjenester;
}

export const IATjenestekort = ({ iaTjeneste }: Props) => {
    const { orgnr, virksomhetsnavn, iaTjeneste: tjeneste, modul, tentativFrist } = iaTjeneste;
    const finskrevetModulNavn = tjeneste.navn === modul.navn ? "" : ` (${modul.navn})`

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
            <Detaljer>
                <Datapunkt><b>IA-tjeneste:</b> {`${tjeneste.navn}${finskrevetModulNavn}`}</Datapunkt>
                <Datapunkt><b>Tentativ frist:</b> {lokalDato(new Date(tentativFrist))}</Datapunkt>
            </Detaljer>
        </Container>
    );
};
