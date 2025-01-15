import { BodyShort, Heading, HeadingProps, HStack } from "@navikt/ds-react";
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

    @media screen and (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const TemaGrafContainer = styled.div`
    border: 1px solid var(--a-gray-300);
    border-radius: var(--a-border-radius-large);
    grid-column: span 1;
    padding: 2rem;
`;

const KategoriTittel = styled(BodyShort) <{ $farge: string }>`
  color: ${(props) => props.$farge || "var(--a-blue-500)"};

  margin-left: 10px;
  margin-bottom: 0.5rem;
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
            <HStack justify="space-between" align="center" as="span">
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
                        {spørsmål.kategori ? <KategoriTittel
                            $farge={getGraffargeFromTema(navn, true)}>
                            {spørsmål.kategori}
                        </KategoriTittel> : null}
                        <BarChart
                            horizontal={spørsmål.flervalg}
                            spørsmål={spørsmål}
                            erIEksportMode={erIEksportMode}
                            farge={getGraffargeFromTema(navn)}
                        />
                    </TemaGrafContainer>
                ))}
            </TemaContainer>
        </>
    );
};

function getGraffargeFromTema(navn: string, mørk: boolean = false) {
    switch (navn?.toLowerCase()) {
        case "sykefraværsarbeid":
            return "var(--a-green-500)";
        case "arbeidsmiljø":
            return `var(--a-orange-${mørk ? '700' : '600'})`;
        case "partssamarbeid":
        default:
            return "var(--a-blue-500)";
    }
}

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
