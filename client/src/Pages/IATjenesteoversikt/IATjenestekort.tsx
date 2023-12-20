import { BodyShort, Link } from "@navikt/ds-react";
import styled from "styled-components";
import { lokalDato } from "../../util/dato";
import { MineIATjenester } from "../../domenetyper/leveranse";
import { hvitBoksMedSkygge } from "../../styling/containere";
import { loggAktvitetPåIATjenesteoversikt } from "../../util/amplitude-klient";
import { mobileAndUp } from "../../styling/breakpoints";

const Container = styled.li`
  padding: 1.5rem;

  ${hvitBoksMedSkygge}
`;

const Detaljer = styled.dl`
  margin-top: 0.5rem;
  
  // For pittesmå skjermar viser vi titlar og data under kvarandre
  display: flex;
  flex-direction: column;
  
  // For vettugt store skjermar viser vi titlar og data i kvar sine kolonner
  ${mobileAndUp} {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: repeat(auto-fill, auto);
    row-gap: 0.5rem;
    column-gap: 1.5rem;
  }
`;

const DetaljerTittel = styled(BodyShort).attrs({ as: "dt" })`
  font-weight: bold;
`;

const DetaljerData = styled(BodyShort).attrs({ as: "dd" })`
  overflow-wrap: anywhere;
  
  // Gjer at det blir avstand mellom ulike tittel-detalje-boksar på pittesmå skjermar
  margin-bottom: 0.5rem;
  
  ${mobileAndUp} {
    margin-bottom: 0;
  }
`;

interface Props {
  iaTjeneste: MineIATjenester;
}

export const IATjenestekort = ({ iaTjeneste }: Props) => {
  const { orgnr, virksomhetsnavn, iaTjeneste: tjeneste, modul, tentativFrist } = iaTjeneste;
  const finskrevetModulNavn = tjeneste.navn === modul.navn ? "" : ` (${modul.navn})`

  return (
    <Container>
      <Detaljer>
        <DetaljerTittel>IA-tjeneste:</DetaljerTittel>
        <DetaljerData>
          {`${tjeneste.navn}${finskrevetModulNavn}`}
        </DetaljerData>
        <DetaljerTittel>Virksomhet:</DetaljerTittel>
        <DetaljerData>
          <Link
            href={`/virksomhet/${orgnr}?fane=ia-tjenester`}
            onClick={() => loggAktvitetPåIATjenesteoversikt()}
          >
            {virksomhetsnavn}
          </Link>
        </DetaljerData>
        <DetaljerTittel>Tentativ frist:</DetaljerTittel>
        <DetaljerData>
          {lokalDato(new Date(tentativFrist))}
        </DetaljerData>
      </Detaljer>
    </Container>
  );
};
