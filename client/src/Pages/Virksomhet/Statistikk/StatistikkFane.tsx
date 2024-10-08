import { Virksomhet } from "../../../domenetyper/virksomhet";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { Heading } from "@navikt/ds-react";
import { Sykefraværsstatistikk } from "./Sykefraværsstatistikk";
import { Historiskstatistikk } from "./Graf/Historiskstatistikk";

const Container = styled.div`
    ${tabInnholdStyling}
`;

interface Props {
    virksomhet: Virksomhet;
}

export const StatistikkFane = ({ virksomhet }: Props) => {
    return (
        <Container>
            <Heading level="3" size="large" spacing={true}>
                Statistikk
            </Heading>
            <Sykefraværsstatistikk
                orgnummer={virksomhet.orgnr}
                bransje={virksomhet.bransje}
                næring={virksomhet.næring}
            />
            <Historiskstatistikk orgnr={virksomhet.orgnr} />
        </Container>
    );
};
