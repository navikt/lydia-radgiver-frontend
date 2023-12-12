import { BodyShort, Heading, Link } from "@navikt/ds-react";
import styled from "styled-components";
import { lokalDato } from "../../util/dato";
import { MineIATjenester } from "../../domenetyper/leveranse";
import { hvitBoksMedSkygge } from "../../styling/containere";
import { loggAktvitetPåIATjenesteoversikt } from "../../util/amplitude-klient";

const Container = styled.li`
  padding: 1.5rem;

  ${hvitBoksMedSkygge}
`;

const Detaljer = styled.dl`
  margin-top: 0.5rem;

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
            <Heading level="2" size="xsmall">
                <Link
                    href={`/virksomhet/${orgnr}?fane=ia-tjenester`}
                      onClick={() => loggAktvitetPåIATjenesteoversikt()}
                >
                    {virksomhetsnavn}
                </Link>
            </Heading>
            <Detaljer>
                <DetaljerTittel as='dt'>IA-tjeneste:</DetaljerTittel>
                <BodyShort as='dd'>
                    {`${tjeneste.navn}${finskrevetModulNavn}`}
                </BodyShort>
                <DetaljerTittel as='dt'>Tentativ frist:</DetaljerTittel>
                <BodyShort as='dd'>
                    {lokalDato(new Date(tentativFrist))}
                </BodyShort>
            </Detaljer>
        </Container>
    );
};
