import { BodyShort, Heading, Link } from "@navikt/ds-react";
import styled from "styled-components";
import { lokalDato } from "../../util/dato";
import { MineIATjenester } from "../../domenetyper/leveranse";
import { hvitBoksMedSkygge } from "../../styling/containere";

const Container = styled.div`
	margin-top: 1.5rem;
	padding: 2rem;
  
    ${hvitBoksMedSkygge}
`;

const HeaderContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
`;

const Detaljer = styled.dl`
    margin-top: 1rem;

    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(auto-fill, auto);
    row-gap: 0.5rem;
    column-gap: 1.5rem;
`;

const DetaljerTittel = styled(BodyShort)`
    font-weight: bold;
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
                <Heading size="medium">
                    <Link
                        href={`/virksomhet/${orgnr}?fane=ia-tjenester`}
                    >
                        {virksomhetsnavn}
                    </Link>
                </Heading>
            </HeaderContainer>
            <Detaljer>
                <DetaljerTittel as='dh'>IA-tjeneste:</DetaljerTittel>
                <BodyShort as='dd'>
                    {`${tjeneste.navn}${finskrevetModulNavn}`}
                </BodyShort>
                <DetaljerTittel as='dh'>Tentativ frist:</DetaljerTittel>
                <BodyShort as='dd'>
                    {lokalDato(new Date(tentativFrist))}
                </BodyShort>
            </Detaljer>
        </Container>
    );
};
