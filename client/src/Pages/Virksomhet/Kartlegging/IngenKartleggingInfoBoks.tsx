import styled from "styled-components";
import { NavFarger } from "../../../styling/farger";
import { Heading } from "@navikt/ds-react";
import React from "react";

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

export interface Props {
    header: string;
    illustrasjon: React.ReactNode;
    children: React.ReactNode;
}

export const IngenKartleggingInfoBoks = ({ children, ...props }: Props) => {
    return (
        <Container>
            <IkonOgContentContainer>
                <IkonContainer>{props.illustrasjon}</IkonContainer>
                <InnholdContainer>
                    <Heading level={"4"} size={"medium"}>
                        {props.header}
                    </Heading>
                    {children}
                </InnholdContainer>
            </IkonOgContentContainer>
        </Container>
    );
};
