import { BodyShort, Heading, Loader } from "@navikt/ds-react";
import { IASak } from "../../../domenetyper/domenetyper";
import { useHentKartleggingResultat } from "../../../api/lydia-api";
import {
    Bar,
    BarChart,
    LabelList,
    Legend,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import styled from "styled-components";
import React from "react";

const Container = styled.div`
    padding-top: 4rem;
    height: 100%;

    display: flex;
    flex-direction: column;
    gap: 3rem;
`;

const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1rem;
`;

const HeadingContainer = styled.div`
    flex-grow: 1;
    width: 20rem;
`;

interface Props {
    iaSak: IASak;
    kartleggingId: string;
}

export const KartleggingResultat = ({ iaSak, kartleggingId }: Props) => {
    const { data: kartleggingResultat, loading: lasterKartleggingResultat } =
        useHentKartleggingResultat(
            iaSak.orgnr,
            iaSak.saksnummer,
            kartleggingId,
        );

    if (lasterKartleggingResultat) {
        return <Loader />;
    }

    if (!kartleggingResultat) {
        return <BodyShort>Kunne ikke hente kartleggingsresultater</BodyShort>;
    }

    const kartleggingerMedProsent = kartleggingResultat.spørsmålMedSvar.map(
        (spørsmål) => {
            const totalAntallSvar = spørsmål.svarListe.reduce(
                (accumulator, svar) => accumulator + svar.antallSvar,
                0,
            );
            const svarListeMedProsent = spørsmål.svarListe.map((svar) => ({
                ...svar,
                prosent: (svar.antallSvar / totalAntallSvar) * 100,
            }));

            return {
                ...spørsmål,
                svarListe: svarListeMedProsent,
            };
        },
    );

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

    return (
        <Container>
            <Heading spacing={true} level="3" size="medium">
                Partssamarbeid
            </Heading>
            {kartleggingerMedProsent.map((spørsmål) => (
                <FlexContainer key={spørsmål.spørsmålId}>
                    <HeadingContainer>
                        <BodyShort weight={"semibold"}>
                            {spørsmål.tekst}
                        </BodyShort>
                    </HeadingContainer>
                    <ResponsiveContainer minHeight={150}>
                        <BarChart
                            width={500}
                            height={300}
                            data={[spørsmål]}
                            layout={"vertical"}
                        >
                            <XAxis hide type={"number"} />
                            <YAxis hide type={"category"} dataKey={"tekst"} />
                            <Legend />
                            {spørsmål.svarListe.map((svar, index) => (
                                <Bar
                                    key={svar.svarId}
                                    dataKey={`svarListe[${index}].prosent`}
                                    stackId={"a"}
                                    fill={getSvarGrafFarge(index)}
                                    name={svar.tekst}
                                    type={"monotone"}
                                >
                                    <LabelList
                                        dataKey={`svarListe[${index}].prosent`}
                                        position={"center"}
                                        fill={"#000"}
                                        fontWeight={"bold"}
                                        formatter={(value: number) =>
                                            `${value.toFixed(1)}%`
                                        }
                                    />
                                </Bar>
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </FlexContainer>
            ))}
        </Container>
    );
};
