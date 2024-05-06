import styled from "styled-components";
import { NavFarger } from "../../../styling/farger";
import { BodyShort, Heading } from "@navikt/ds-react";
import React from "react";
import { Person1Svg } from "../../../components/Person1Svg";

const Container = styled.div`
    margin-top: 1rem;
    margin-left: 2rem;
    margin-bottom: 1rem;
    border: ${NavFarger.deepblue400} solid 2px;
    border-radius: 10px;
`;
const IkonOgContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;
const IkonContainer = styled.div`
    margin-left: -2rem;
`;
const InnholdContainer = styled.div`
    padding: 1.5rem;
`;

export const IngenKartleggingInfoBoks = () => {
    return (
        <Container>
            <IkonOgContentContainer>
                <IkonContainer>
                    <Person1Svg size={60} />
                </IkonContainer>
                <InnholdContainer>
                    <Heading level={"4"} size={"medium"}>
                        Her var det tomt
                    </Heading>
                    <BodyShort style={{ marginTop: ".5rem" }}>
                        Du har ikke startet behovsvurdering for denne
                        virksomheten enda. For å komme igang trykker du på Ny
                        behovsvurdering knappen som ligger over dette feltet.
                    </BodyShort>
                </InnholdContainer>
            </IkonOgContentContainer>
        </Container>
    );
};
