import styled from "styled-components";
import { BodyShort, Detail, HelpText } from "@navikt/ds-react";
import { NavFarger } from "../../../../styling/farger";
import { BorderRadius } from "../../../../styling/borderRadius";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;

  background: ${NavFarger.canvasBackground};
  border-radius: ${BorderRadius.medium};

  padding: ${12 / 16}rem ${24 / 16}rem;
`;

const TittelMedHelpTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;

const Tittel = styled(BodyShort)`
  font-weight: bold;
  padding-top: ${12 / 16}rem;
  padding-bottom: ${12 / 16}rem;
  padding-left: ${24 / 16}rem;
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

export const Statistikkboks = ({tittel, helpTekst, verdi, verdiSisteKvartal}: Props) => {
    return (
        <Container>
            <TittelMedHelpTextContainer>
                <Tittel as="dt">
                    {tittel}
                </Tittel>
                <HelpText title="Hvor kommer dette fra?">
                    {helpTekst}
                </HelpText>
            </TittelMedHelpTextContainer>

            <Verdi as="dd">{verdi}</Verdi>
            <VerdiSisteKvartal as="dd" hidden={!verdiSisteKvartal}>
                {`${verdiSisteKvartal?.verdi} i ${verdiSisteKvartal?.kvartal}. kvartal ${verdiSisteKvartal?.år}`}
            </VerdiSisteKvartal>
        </Container>
    );
};
