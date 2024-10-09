import { Heading, HeadingProps } from "@navikt/ds-react";
import styled from "styled-components";
import BarChart from "./Grafer/BarChart";

const TemaContainer = styled.div`
    display: grid;
    grid-template-columns: calc(50% - 2rem) calc(50% - 2rem);
    justify-items: stretch;
    width: 100%;
    padding-bottom: 4rem;
    gap: 2rem;
`;

const TemaGrafContainer = styled.div<{ $brukBorder: boolean }>`
    border: 1px solid var(--a-gray-300);
    border-radius: var(--a-border-radius-large);
    grid-column: span 1;
    padding: 2rem;
`;

type SpørsmålMedSvar = {
    spørsmålId: string;
    tekst: string;
    flervalg: boolean;
    svarListe: { tekst: string; svarId: string; antallSvar: number }[];
};
interface Props {
    navn: string;
    spørsmålMedSvar: SpørsmålMedSvar[];
    erIEksportMode?: boolean;
    headingSize?: HeadingProps["size"];
}

export const TemaResultat = ({
    navn,
    spørsmålMedSvar,
    erIEksportMode = false,
    headingSize = "medium",
}: Props) => {
    return (
        <>
            <Heading
                spacing={true}
                level="3"
                size={headingSize}
                style={{ marginBottom: "2rem" }}
            >
                {navn}
            </Heading>
            <TemaContainer>
                {spørsmålMedSvar.map((spørsmål) => (
                    <TemaGrafContainer
                        $brukBorder={true}
                        key={spørsmål.spørsmålId}
                    >
                        {spørsmål.flervalg ? (
                            <BarChart
                                horizontal
                                spørsmål={spørsmål}
                                erIEksportMode={erIEksportMode}
                            />
                        ) : (
                            <BarChart
                                spørsmål={spørsmål}
                                erIEksportMode={erIEksportMode}
                            />
                        )}
                    </TemaGrafContainer>
                ))}
            </TemaContainer>
        </>
    );
};
