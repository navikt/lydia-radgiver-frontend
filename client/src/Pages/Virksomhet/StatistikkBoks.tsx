import styled from "styled-components";
import { BodyShort, Detail } from "@navikt/ds-react";
import { NavFarger } from "../../styling/farger";
import { BorderRadius } from "../../styling/borderRadius";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;

  background: ${NavFarger.canvasBackground};
  border-radius: ${BorderRadius.medium};

  padding: ${12 / 16}rem ${24 / 16}rem;
  min-width: ${230 / 16}rem;
`;

const Tittel = styled(BodyShort)`
  font-weight: bold;
`;

const Verdi = styled(BodyShort)`
  font-weight: bold;
  font-size: 2.5rem;
  line-height: 1.3;
`;

const VerdiSisteKvartal = styled(Detail).attrs({size: 'small'})<{ hidden: boolean }>`
  display: ${props => props.hidden ? 'none' : 'initial'};
`;

interface Props {
    tittel: string;
    verdi: string;
    verdiSisteKvartal?: string;
}

export const StatistikkBoks = ({ tittel, verdi, verdiSisteKvartal}: Props) => {
    return (
        <Container>
            <Tittel>
                {tittel}
            </Tittel>
            <Verdi>{verdi}</Verdi>
            <VerdiSisteKvartal hidden={!verdiSisteKvartal}>
                {`(${verdiSisteKvartal} i siste kvartal)`}
            </VerdiSisteKvartal>
        </Container>
    );
};
