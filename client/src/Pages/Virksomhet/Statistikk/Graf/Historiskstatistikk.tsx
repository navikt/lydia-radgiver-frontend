import styled from "styled-components";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Symbols, XAxis, YAxis } from "recharts";
import { BodyShort, Heading } from "@navikt/ds-react";
import { SymbolSvg } from "./SymbolSvg";
import { useHentHistoriskstatistikk } from "../../../../api/lydia-api";
import { sorterKvartalStigende } from "../../../../util/sortering";
import { graphTooltip } from "./GraphTooltip";
import { Kvartal } from "../../../../domenetyper/kvartal";

const Container = styled.div`
  padding-top: 4rem;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 3rem;
`;
const Legend = styled.div`
  padding-top: 1rem;
  padding-bottom: 2rem;

  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
`;

interface HistoriskStatistikkProps {
    orgnr: string;
}

const linjebredde = 2;
const dotStrl = 40;
const kvartalSomTekst = (årstall: number, kvartal: number) =>
    årstall + ', ' + kvartal + '. kvartal';

export const Historiskstatistikk = ({ orgnr }: HistoriskStatistikkProps) => {
    const {
        data: historiskStatistikk
    } = useHentHistoriskstatistikk(orgnr)

    if (!historiskStatistikk) {
        return null;
    }

    interface Datapunkt {
        name: string;
        virksomhet: number | null;
    }

    const alleKvartalerTilgjengelig: Kvartal[] = [
        { årstall: 2020, kvartal: 1 },
        { årstall: 2020, kvartal: 2 },
        { årstall: 2020, kvartal: 3 },
        { årstall: 2020, kvartal: 4 },
        { årstall: 2021, kvartal: 1 },
        { årstall: 2021, kvartal: 2 },
        { årstall: 2021, kvartal: 3 },
        { årstall: 2021, kvartal: 4 },
        { årstall: 2022, kvartal: 1 },
        { årstall: 2022, kvartal: 2 },
        { årstall: 2022, kvartal: 3 },
        { årstall: 2022, kvartal: 4 },
        { årstall: 2023, kvartal: 1 },
        { årstall: 2023, kvartal: 2 },
    ]

    const leggTilManglendeKvartaler = (liste: Datapunkt[]): Datapunkt[] => {

        const listeMedAlleKvartaler: Datapunkt[] = []

        alleKvartalerTilgjengelig
            .map(
                kvartal => {
                    return {
                        name: `${kvartalSomTekst(kvartal.årstall, kvartal.kvartal)}`,
                        virksomhet: null,
                    }
                }
            ).forEach(element => {
                const funnet = liste.find(datapunkt => {return datapunkt.name === element.name})

                if (funnet) {
                    listeMedAlleKvartaler.push(funnet)
                } else {
                    listeMedAlleKvartaler.push(element)
                }
            })
        return listeMedAlleKvartaler
    }

    const detSomSkalVises = leggTilManglendeKvartaler(historiskStatistikk.virksomhetsstatistikk.statistikk
        .sort(sorterKvartalStigende)
        .map(
            statistikk => {
                return {
                    name: `${kvartalSomTekst(statistikk.årstall, statistikk.kvartal)}`,
                    virksomhet: statistikk.maskert ? null : statistikk.sykefraværsprosent
                }
            }
        )
    )

    const førstekvartalIHvertÅr = detSomSkalVises.filter((it) => {
        return it.name.includes("1. kvartal");
    }).map(it => it.name)

    return (
        <Container>
            <div>
                <Heading spacing={true} level="4" size="medium">Historisk statistikk</Heading>
                <BodyShort>
                    Her kan du se hvordan det legemeldte sykefraværet utvikler seg over tid.
                </BodyShort>
                <Legend>
                    <SymbolSvg size={dotStrl} fill={"red"} />
                    <BodyShort>
                        Virksomhet
                    </BodyShort>
                </Legend>
            </div>

            <ResponsiveContainer minHeight={400}>
                <LineChart
                    data={detSomSkalVises}
                    role="img"
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#C6C2BF" />
                    <Line type="monotone"
                          dataKey="virksomhet"
                          stroke="red"
                          strokeWidth={linjebredde}
                          isAnimationActive={false}
                          dot={<Symbols type={"circle"} size={dotStrl} fill={"red"} />}
                    />
                    <XAxis
                        dataKey="name"
                        tickFormatter={(tickValue) => tickValue.substring(0, 4)} // Bare vis år-delen av "name"
                        ticks={førstekvartalIHvertÅr} // på same format som "name"
                    />
                    <YAxis tickFormatter={(value) => (`${value} %`)} />
                    {graphTooltip()}
                </LineChart>
            </ResponsiveContainer>
        </Container>
    )
}
