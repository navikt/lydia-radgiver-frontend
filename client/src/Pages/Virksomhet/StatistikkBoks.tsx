import styled from "styled-components";
import { BodyShort, Detail, HelpText } from "@navikt/ds-react";
import { NavFarger } from "../../styling/farger";
import { BorderRadius } from "../../styling/borderRadius";

const TittelMedHelpTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

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
  padding: ${12 / 16}rem ${24 / 16}rem;
`;

const Verdi = styled(BodyShort)`
  font-weight: bold;
  font-size: 2.5rem;
  line-height: 1.3;
`;

const VerdiSisteKvartal = styled(Detail).attrs({size: 'small'})<{ hidden: boolean }>`
  display: ${props => props.hidden ? 'none' : 'initial'};
`;

interface VerdiSisteKvartal {
    verdi: string;
    år: number;
    kvartal: number;
}

interface Props {
    tittel: string;
    helpTekst: string;
    verdi: string;
    verdiSisteKvartal?: VerdiSisteKvartal;
}

export const StatistikkBoks = ({tittel, helpTekst, verdi, verdiSisteKvartal}: Props) => {
    return (
        <Container>
            <TittelMedHelpTextContainer>
                <Tittel>
                    {tittel}
                </Tittel>
                <HelpText title="Hvor kommer dette fra?">
                    {helpTekst}
                </HelpText>
            </TittelMedHelpTextContainer>

            <Verdi>{verdi}</Verdi>
            <VerdiSisteKvartal hidden={!verdiSisteKvartal}>
                {`${verdiSisteKvartal?.verdi} i ${verdiSisteKvartal?.kvartal}. kvartal ${verdiSisteKvartal?.år}`}
            </VerdiSisteKvartal>
        </Container>
    );
};
