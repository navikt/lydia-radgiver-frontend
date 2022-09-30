import { Virksomhet } from "../../domenetyper";
import styled from "styled-components";
import { BodyShort, Label } from "@navikt/ds-react";

const VerticalFlexboxDiv = styled.div`
  display: flex;
  flex-direction: column;
`;
const HorizontalFlexboxDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3rem;
`;

interface Props {
    virksomhet: Virksomhet;
    className?: string;
}

export const VirksomhetInformasjon = ({virksomhet, className}: Props) => (
    <HorizontalFlexboxDiv className={className}>
        <VerticalFlexboxDiv>
            <Label>Orgnummer</Label>
            <BodyShort size={"medium"}>{virksomhet.orgnr}</BodyShort>
        </VerticalFlexboxDiv>
        <VerticalFlexboxDiv>
            <Label>Adresse</Label>
            {virksomhet.adresse.map((x) => (
                <BodyShort key={`adresse-${x}`}>{x}</BodyShort>
            ))}
            <BodyShort>
                {virksomhet.postnummer} {virksomhet.poststed}
            </BodyShort>
        </VerticalFlexboxDiv>
        <VerticalFlexboxDiv>
            <Label>Bransje/næring</Label>
            {virksomhet.neringsgrupper.map(({navn, kode}) => (
                <BodyShort key={navn}>{navn} ({kode})</BodyShort>
            ))}
        </VerticalFlexboxDiv>
    </HorizontalFlexboxDiv>
);
