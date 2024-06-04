import { Heading } from "@navikt/ds-react";
import styled from "styled-components";
import PieChart from "./Grafer/PieChart";
import BarChart from "./Grafer/BarChart";

const TemaContainer = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr 1fr;
  justify-items: stretch;
  width: 100%;
  padding-bottom: 4rem;
`;

const TemaGrafContainer = styled.div<{ ekstraBredde: boolean }>`
    grid-column: ${(props) => (props.ekstraBredde ? "span 2" : "span 1")};
    padding-top: 2rem;
    padding-bottom: 2rem;
`;

type SpørsmålMedSvar = {
  spørsmålId: string;
  tekst: string;
  flervalg: boolean;
  svarListe: { tekst: string; svarId: string; antallSvar: number }[];
};
interface Props {
    beskrivelse: string;
    spørsmålMedSvar: SpørsmålMedSvar[];
}

export const TemaResultat = ({
    beskrivelse,
    spørsmålMedSvar,
}: Props) => {
    return (
        <>
            <Heading spacing={true} level="3" size="medium">
                {beskrivelse}
            </Heading>
            <TemaContainer>
              {spørsmålMedSvar.map((spørsmål, index) => (
                  <TemaGrafContainer
                  ekstraBredde={trengerEkstraBredde(spørsmålMedSvar, spørsmål, index)}
                  key={spørsmål.spørsmålId}
                >
                  {spørsmål.flervalg ? (
                    <PieChart spørsmål={spørsmål} />
                  ) : (
                    <BarChart spørsmål={spørsmål} />
                  )}
                </TemaGrafContainer>
              ))}
            </TemaContainer>
        </>
    );
};


function trengerEkstraBredde(
  spørsmålMedSvar: SpørsmålMedSvar[],
    spørsmål: SpørsmålMedSvar,
    index: number,
  ) {
    if (spørsmål.flervalg) {
      return true;
    }
    // Tving bar-chart til å ta full row om vi ender opp men en alene.
    if (index === 0 || spørsmålMedSvar[index - 1].flervalg) {
      // Hvis vi er første etter start eller flervalg (vi er på en ny linje med ikke-flervalg)
  
      const nesteFlervalg = spørsmålMedSvar.findIndex(
        (spm, ind) => spm.flervalg && ind > index,
      );
      const nesteLineBreak =
        nesteFlervalg === -1 ? spørsmålMedSvar.length : nesteFlervalg;
  
      const antallSpørsmål = nesteLineBreak - index;
  
      if (antallSpørsmål % 2 === 1) {
        return true;
      }
    }
  
    return false;
  }