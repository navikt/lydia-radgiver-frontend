import React from "react";
import styled from "styled-components";
import { Detail, Loader } from "@navikt/ds-react";
import { ANTALL_RESULTATER_PER_SIDE } from "./Prioriteringsside";
import { Paginering } from "./Paginering";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 1rem;
`;

const PagineringsContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ResultatInfo = styled(Detail)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

interface Props {
    side: number;
    endreSide: (side: number) => void;
    antallTreffPåSide: number;
    totaltAntallTreff?: number;
}

export const SøkeresultatFooter = ({side, antallTreffPåSide, endreSide, totaltAntallTreff}: Props) => {
    const sideOffset = (side - 1) * ANTALL_RESULTATER_PER_SIDE
    const resultatFra = sideOffset + 1;
    const resultatTil = Math.min(sideOffset + antallTreffPåSide, side * ANTALL_RESULTATER_PER_SIDE);

    return (
        <Container>
            <PagineringsContainer>
                <Paginering side={side} endreSide={endreSide} antallTreffPåSide={antallTreffPåSide} />
                <ResultatInfo size="small">
                    Viser resultat {resultatFra} - {resultatTil} av {totaltAntallTreff ??
                    <Loader size="xsmall" title="henter antall treff" />}
                </ResultatInfo>
            </PagineringsContainer>

            <Detail size="small">
                Tallene viser offisiell sykefraværsstatistikk for andre kvartal 2022.
            </Detail>
        </Container>
    )
}