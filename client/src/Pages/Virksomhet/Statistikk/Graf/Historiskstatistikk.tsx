import styled from "styled-components";
import { BodyShort, Heading, ToggleGroup } from "@navikt/ds-react";
import { useHentHistoriskstatistikk } from "../../../../api/lydia-api";
import Graf from "./Graf";
import React from "react";
import Tabell from "../Tabell/Tabell";

const Container = styled.div`
  padding-top: 4rem;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

interface HistoriskStatistikkProps {
    orgnr: string;
}

export const Historiskstatistikk = ({ orgnr }: HistoriskStatistikkProps) => {
    const {
        data: historiskStatistikk
    } = useHentHistoriskstatistikk(orgnr);
    const [visTabell, setVisTabell] = React.useState(false);

    if (!historiskStatistikk) {
        return null;
    }


    return (
        <Container>
            <FlexContainer>

                <div>
                    <Heading spacing={true} level="4" size="medium">Historisk statistikk</Heading>
                    <BodyShort>
                        Her kan du se hvordan det legemeldte sykefraværet utvikler seg over tid.
                    </BodyShort>
                </div>
                <ToggleGroup
                    className="historikk__toggle-group"
                    value={visTabell ? "tabell" : "graf"}
                    aria-label="Hvis du bruker skjermleser, bør du velge tabell"
                    onChange={(value) => {
                        setVisTabell(value === "tabell");
                    }}
                >
                    <ToggleGroup.Item value="graf">Graf</ToggleGroup.Item>
                    <ToggleGroup.Item value="tabell">Tabell</ToggleGroup.Item>
                </ToggleGroup>
            </FlexContainer>
            {
                visTabell ?
                    <Tabell historiskStatistikk={historiskStatistikk} /> :
                    <Graf historiskStatistikk={historiskStatistikk} />
            }
        </Container>
    )
}
