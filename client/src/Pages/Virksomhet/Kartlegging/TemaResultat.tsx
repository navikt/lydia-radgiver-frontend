import { Heading } from "@navikt/ds-react";
import styled from "styled-components";
import PieChart from "./Grafer/PieChart";
import BarChart from "./Grafer/BarChart";

const TemaContainer = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  justify-items: stretch;
  width: 100%;
  padding-bottom: 4rem;
  gap: 2rem;
`;

const TemaGrafContainer = styled.div<{ $brukBorder: boolean }>`
    border: ${({ $brukBorder }) => $brukBorder ? "1px solid var(--a-gray-300)" : "none"};
    border-radius: var(--a-border-radius-large);
    grid-column: span 1;
    padding: 2rem;
`;

type SpørsmålMedSvar = {
  spørsmålId: string;
  tekst: string;
  flervalg: boolean;
  svarListe: { tekst: string; svarId: string; antallSvar: number }[];
};
interface Props {
  navn: string;
  spørsmålMedSvar: SpørsmålMedSvar[];
  erIEksportMode?: boolean;
}

export const TemaResultat = ({
  navn,
  spørsmålMedSvar,
  erIEksportMode = false,
}: Props) => {
  return (
    <>
      <Heading spacing={true} level="3" size="medium" style={{ marginBottom: "2rem" }}>
        {navn}
      </Heading>
      <TemaContainer>
        {spørsmålMedSvar.map((spørsmål) => (
          <TemaGrafContainer
            $brukBorder={erIEksportMode}
            key={spørsmål.spørsmålId}
          >
            {spørsmål.flervalg ? (
              <PieChart spørsmål={spørsmål} erIEksportMode={erIEksportMode} />
            ) : (
              <BarChart spørsmål={spørsmål} erIEksportMode={erIEksportMode} />
            )}
          </TemaGrafContainer>
        ))}
      </TemaContainer>
    </>
  );
};
