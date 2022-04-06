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
    virksomhet: Virksomhet
}

export const VirksomhetInformasjon = ({ virksomhet }: Props) => (
    <HorizontalFlexboxDiv>
        <VerticalFlexboxDiv>
            <h4>Orgnummer</h4>
            <Detail size={"small"}>{virksomhet.orgnr}</Detail>
        </VerticalFlexboxDiv>
        <VerticalFlexboxDiv>
            <h4>Bransje/næring</h4>
            {virksomhet.neringsgrupper.map(({ navn}) => (
                <Detail size={"small"} key={navn}>{navn}</Detail>
            ))}
        </VerticalFlexboxDiv>
        <VerticalFlexboxDiv>
            <h4>Adresse</h4>
            {virksomhet.adresse.map(x => (
                <Detail size={"small"} key={`adresse-${x}`}>{x}</Detail>
            ))}
            <Detail size={"small"}>{virksomhet.postnummer} {virksomhet.poststed}</Detail>
        </VerticalFlexboxDiv>
    </HorizontalFlexboxDiv>
)

