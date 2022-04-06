import {Virksomhet} from "../../domenetyper";
import styled from "styled-components";
import {Detail} from "@navikt/ds-react";


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
    virksomhet: Virksomhet,
    className? : string
}

export const VirksomhetInformasjon = ({ virksomhet, className }: Props) => (
    <HorizontalFlexboxDiv className={className}>
        <VerticalFlexboxDiv>
            <Detail>Orgnummer</Detail>
            <Detail size={"small"}>{virksomhet.orgnr}</Detail>
        </VerticalFlexboxDiv>
        <VerticalFlexboxDiv>
            <Detail>Adresse</Detail>
            {virksomhet.adresse.map(x => (
                <Detail size={"small"} key={`adresse-${x}`}>{x}</Detail>
            ))}
            <Detail size={"small"}>{virksomhet.postnummer} {virksomhet.poststed}</Detail>
        </VerticalFlexboxDiv>
        <VerticalFlexboxDiv>
            <Detail>Bransje/næring</Detail>
            {virksomhet.neringsgrupper.map(({ navn}) => (
                <Detail size={"small"} key={navn}>{navn}</Detail>
            ))}
        </VerticalFlexboxDiv>
    </HorizontalFlexboxDiv>
)

