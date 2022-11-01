import { Virksomhet } from "../../domenetyper";
import styled from "styled-components";
import { BodyShort, Label } from "@navikt/ds-react";
import { NavFarger } from "../../styling/farger";

const Container = styled.div`
  display: grid;
  grid-template: auto auto auto / auto 1fr;
  row-gap: 0.5rem;
  column-gap: 1.5rem;

  padding: 1.5rem;
  border: 1px solid ${NavFarger.borderMuted};
  border-radius: 4px;
`;

const InfoTittel = styled(Label)`
  font-weight: bold;
`;

const InfoData = styled(BodyShort)`
  overflow-wrap: anywhere;
`;

interface Props {
    virksomhet: Virksomhet;
    className?: string;
}

export const VirksomhetInformasjon = ({virksomhet, className}: Props) => {
    const adresse = virksomhet.adresse.join(', ');
    const næringsgrupper: string = virksomhet.neringsgrupper.map(({navn, kode}) => (`${navn} (${kode})`)).join(', ')

    return (
        <Container className={className}>
            <InfoTittel>Orgnummer</InfoTittel>
            <InfoData size={"medium"}>{virksomhet.orgnr}</InfoData>
            <InfoTittel>Adresse</InfoTittel>
            <InfoData>
                {adresse}, {virksomhet.postnummer} {virksomhet.poststed}
            </InfoData>
            <InfoTittel>Bransje/næring</InfoTittel>
            <InfoData>{næringsgrupper}</InfoData>
        </Container>
    );
};

