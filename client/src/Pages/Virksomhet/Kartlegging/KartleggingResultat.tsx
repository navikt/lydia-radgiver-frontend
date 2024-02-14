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
    /* const { data: kartleggingResultat, loading: lasterKartleggingResultat } =
        useHentKartleggingResultat(
            iaSak.orgnr,
            iaSak.saksnummer,
            kartleggingId,
        ); */

    const kartleggingResultat = {
        "kartleggingId": "4eac4a4f-c86d-43d5-8fbb-2916810ddbe5",
        "spørsmålMedSvar": [
          {
            "spørsmålId": "b16c4b1c-b45e-470d-a1a5-d6f87424d410",
            "tekst": "Hvilke av disse faktorene tror du har størst innflytelse på sykefraværet der du jobber?",
            "svarListe": [
              {
                "svarId": "5f21cef2-dcab-41df-9d58-c3d4a76463e9",
                "tekst": "Arbeidsbelastning",
                "antallSvar": 10
              },
              {
                "svarId": "ff8e9502-cd3b-4a9d-b7c4-da0fffc7b39a",
                "tekst": "Arbeidstid",
                "antallSvar": 2
              },
              {
                "svarId": "3a03a39a-f51c-4fb2-9ec0-987b0ad8ad2b",
                "tekst": "Arbeidsforhold",
                "antallSvar": 0
              },
              {
                "svarId": "c62fc7b1-9e8b-4311-8404-adcaafe6863f",
                "tekst": "Ledelse",
                "antallSvar": 0
              },
              {
                "svarId": "20f32634-3e5d-462b-b45a-20c1642c51f7",
                "tekst": "Noe annet",
                "antallSvar": 0
              }
            ]
          },
          {
            "spørsmålId": "61a9a84a-949b-4f46-97e5-c9b60e01d433",
            "tekst": "Velg det tiltaket som du mener best kan bidra til å forebygge sykefraværet",
            "svarListe": [
              {
                "svarId": "979e6e23-4774-4eee-aa77-ad4458d7c717",
                "tekst": "Bedre oppfølging av ansatte",
                "antallSvar": 0
              },
              {
                "svarId": "d7f68972-3111-4720-8dcb-c70f482a4e62",
                "tekst": "Tilrettelegging av arbeidsoppgaver",
                "antallSvar": 0
              },
              {
                "svarId": "be427184-1707-44e2-9b17-9284369ad036",
                "tekst": "Kompetanseutvikling",
                "antallSvar": 0
              },
              {
                "svarId": "a0746b2f-4856-4ca4-835d-2510cb37d9cb",
                "tekst": "Helsefremmende aktiviteter",
                "antallSvar": 0
              },
              {
                "svarId": "8c4c0039-a94f-47c7-8b5c-cf50525f3049",
                "tekst": "Noe annet",
                "antallSvar": 0
              }
            ]
          },
          {
            "spørsmålId": "62b3a863-cba3-4c92-8c7e-19d8b4688d49",
            "tekst": "Vi har kunnskap og ferdigheter til å gjennomføre forbedringstiltak i virksomheten (planlegge tiltak, gjennomføre og evaluere måloppnåelse)",
            "svarListe": [
              {
                "svarId": "a0228a17-3139-48a3-a74d-8d82da096d1e",
                "tekst": "Helt uenig",
                "antallSvar": 0
              },
              {
                "svarId": "72e6e4e4-0ea2-487e-8148-666736da1ac9",
                "tekst": "Litt uenig",
                "antallSvar": 0
              },
              {
                "svarId": "9ae92351-6393-4fb7-8eea-9bc2d7c817f4",
                "tekst": "Litt enig",
                "antallSvar": 0
              },
              {
                "svarId": "1e7d07a2-7dea-4978-a37f-1f23f87fbf71",
                "tekst": "Veldig enig",
                "antallSvar": 0
              },
              {
                "svarId": "ea3c20d2-8ee9-4fbb-b3b8-4f54e420321e",
                "tekst": "Vet ikke",
                "antallSvar": 0
              }
            ]
          }
        ]
      };

      const lasterKartleggingResultat = false;

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
                    <ResponsiveContainer minHeight={150} >
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
                                    name={`${svar.tekst}: ${isNaN(svar.prosent) ? 0 : svar.prosent.toFixed(0)}%`}
                                    type={"monotone"}
                                >
                                    <LabelList
                                        dataKey={`svarListe[${index}].prosent`}
                                        position={"center"}
                                        fill={"#000"}
                                        fontWeight={"bold"}
                                        formatter={(value: number) =>
                                            value !== 0 ? `${value.toFixed(0)}%` : null
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
