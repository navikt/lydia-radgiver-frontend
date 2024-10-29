import { Heading, HeadingProps, HStack } from "@navikt/ds-react";
import styled from "styled-components";
import BarChart from "./Grafer/BarChart";
import { PersonGroupFillIcon } from "@navikt/aksel-icons";
import { SpørsmålResultat } from "../../domenetyper/spørreundersøkelseResultat";

const TemaContainer = styled.div`
    display: grid;
    grid-template-columns: calc(50% - 1rem) calc(50% - 1rem);
    justify-items: stretch;
    width: 100%;
    padding-bottom: 4rem;
    gap: 2rem;
`;

const TemaGrafContainer = styled.div`
    border: 1px solid var(--a-gray-300);
    border-radius: var(--a-border-radius-large);
    grid-column: span 1;
    padding: 2rem;
`;

interface Props {
    navn: string;
    spørsmålResultat: SpørsmålResultat[];
    erIEksportMode?: boolean;
    headingSize?: HeadingProps["size"];
}

export const TemaResultat = ({
    navn,
    spørsmålResultat,
    erIEksportMode = false,
    headingSize = "medium",
}: Props) => {
    return (
        <>
            <HStack justify="space-between" align="center">
                <Heading level="3" size={headingSize}>
                    {navn}
                </Heading>
                <AntallDeltakere
                    antallDeltakere={Math.min(
                        ...spørsmålResultat.map(
                            (spørsmål: SpørsmålResultat) =>
                                spørsmål.antallDeltakereSomHarSvart,
                        ),
                    )}
                />
            </HStack>
            <TemaContainer>
                {spørsmålResultat.map((spørsmål: SpørsmålResultat) => (
                    <TemaGrafContainer key={spørsmål.id}>
                        <BarChart
                            horizontal={spørsmål.flervalg}
                            spørsmål={spørsmål}
                            erIEksportMode={erIEksportMode}
                        />
                    </TemaGrafContainer>
                ))}
            </TemaContainer>
        </>
    );
};

const StyledDeltakere = styled(HStack)`
    color: var(--a-blue-500);
    font-size: 1.25rem;
    gap: 1rem;
    margin-right: 2rem;
`;

export function AntallDeltakere({
    antallDeltakere,
}: {
    antallDeltakere: number;
}) {
    return (
        <StyledDeltakere align="center">
            <PersonGroupFillIcon fontSize="1.5rem" aria-hidden />
            {antallDeltakere} deltakere
        </StyledDeltakere>
    );
}
