import styled from "styled-components";
import { BodyShort } from "@navikt/ds-react";
import React from "react";

const ChartWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 2rem;
`;

const BarWrapper = styled.div`
    display: flex;
    width: 100%;
`;

const Bar = styled.div<{ $prosent: number; $farge: string }>`
    background-color: ${(props) => props.$farge};
    width: ${(props) => props.$prosent}%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
`;

const LabelList = styled.ul`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-left: -3rem;
    margin-top: 1rem;
`;

const Label = styled.li`
    list-style-type: none;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 3rem;
`;

const BoldText = styled.span`
    font-weight: bold;
`;

const LabelBox = styled.div<{ $farge: string }>`
    width: 1rem;
    height: 1rem;
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    background-color: ${(props) => props.$farge};
`;

export default function KartleggingResultatChart({
    visSomProsent,
    spørsmål,
}: {
    visSomProsent: boolean;
    spørsmål: {
        spørsmålId: string;
        tekst: string;
        svarListe: { tekst: string; svarId: string; antallSvar: number }[];
    };
}) {
    const svarGrafFarger: string[] = [
        "#8884d8",
        "#82ca9d",
        "#ffc658",
        "#ff8042",
        "#8dd1e1",
    ];

    function getSvarGrafFarge(index: number): string {
        return svarGrafFarger[index % svarGrafFarger.length];
    }

    const MINIMUM_ANTALL_DELTAKERE = 3;

    const harNokDeltakere =
        spørsmål.svarListe.reduce(
            (prev, current) => prev + current.antallSvar,
            0,
        ) >= MINIMUM_ANTALL_DELTAKERE;

    const totalAntallSvar = spørsmål.svarListe.reduce(
        (accumulator, svar) => accumulator + svar.antallSvar,
        0,
    );
    const svarListeMedProsent = spørsmål.svarListe.map((svar) => ({
        ...svar,
        prosent: (svar.antallSvar / totalAntallSvar) * 100,
    }));

    return (
        <ChartWrapper>
            <BarWrapper>
                {harNokDeltakere ? (
                    svarListeMedProsent.map(
                        (svar, index) =>
                            svar.prosent > 0 && (
                                <Bar
                                    key={svar.svarId}
                                    $prosent={svar.prosent}
                                    $farge={getSvarGrafFarge(index)}
                                />
                            ),
                    )
                ) : (
                    <Bar $prosent={100} $farge="#ccc">
                        For få deltakere
                    </Bar>
                )}
            </BarWrapper>
            <LabelList>
                {svarListeMedProsent.map((svar, index) => (
                    <Label key={svar.svarId}>
                        {harNokDeltakere ? (
                            <>
                                <LabelBox $farge={getSvarGrafFarge(index)} />
                                {visSomProsent ? (
                                    <BodyShort size={"medium"}>
                                        <BoldText>{svar.tekst}</BoldText>{" "}
                                        {svar.prosent.toFixed(0)}%
                                    </BodyShort>
                                ) : (
                                    <BodyShort size={"medium"}>
                                        <BoldText>{svar.tekst}</BoldText> (
                                        {svar.antallSvar.toFixed(0)})
                                    </BodyShort>
                                )}
                            </>
                        ) : (
                            <>
                                <LabelBox $farge={getSvarGrafFarge(index)} />{" "}
                                <BoldText>{svar.tekst}</BoldText>
                            </>
                        )}
                    </Label>
                ))}
            </LabelList>
        </ChartWrapper>
    );
}
