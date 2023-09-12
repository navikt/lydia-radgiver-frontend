import styled from "styled-components";
import {BodyShort} from "@navikt/ds-react";
import {NavFarger} from "../../../styling/farger";
import {BorderRadius} from "../../../styling/borderRadius";
import {Virksomhet} from "../../../domenetyper/virksomhet";

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: repeat(auto-fill, auto);
  row-gap: 0.5rem;
  column-gap: 1.5rem;

  padding: 1.5rem;
  border: 1px solid ${NavFarger.borderMuted};
  border-radius: ${BorderRadius.medium};
`;

const InfoTittel = styled(BodyShort)`
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
    const capitalizedLabel = (label :string) => {
        const lowerCasedLabel: string = label.toLowerCase()
        return lowerCasedLabel[0].toUpperCase() + lowerCasedLabel.slice(1)
    }

    return (
        <Container className={className}>
            <InfoTittel>Orgnummer</InfoTittel>
            <InfoData>{virksomhet.orgnr}</InfoData>
            <InfoTittel>Adresse</InfoTittel>
            <InfoData>{adresse}, {virksomhet.postnummer} {virksomhet.poststed}</InfoData>
            { virksomhet.bransje &&
                <>
                    <InfoTittel>Bransje</InfoTittel>
                    <InfoData>{capitalizedLabel(virksomhet.bransje)}</InfoData>
                </>
            }
            <InfoTittel>Næring</InfoTittel>
            <InfoData>
                {virksomhet.næringsundergruppe1.navn} ({virksomhet.næringsundergruppe1.kode})
                {virksomhet.næringsundergruppe2 && `, ${virksomhet.næringsundergruppe2.navn} (${virksomhet.næringsundergruppe2.kode})`}
                {virksomhet.næringsundergruppe3 && `, ${virksomhet.næringsundergruppe3.navn} (${virksomhet.næringsundergruppe3.kode})`}
            </InfoData>
            {virksomhet.sektor &&
                (<>
                    <InfoTittel>Sektor</InfoTittel>
                    <InfoData>{virksomhet.sektor}</InfoData>
                </>)
            }
        </Container>
    );
};

