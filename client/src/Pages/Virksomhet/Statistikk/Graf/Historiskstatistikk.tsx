import styled from "styled-components";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Symbols, XAxis, YAxis } from "recharts";
import { BodyShort, Heading } from "@navikt/ds-react";
import { useHentHistoriskstatistikk, useHentPubliseringsinfo } from "../../../../api/lydia-api";
import { sorterKvartalStigende } from "../../../../util/sortering";
import { graphTooltip } from "./GraphTooltip";
import { graflinjer } from "./graflinjer";
import { LegendMedToggles } from "./LegendMedToggles";

const Container = styled.div`
  padding-top: 4rem;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 3rem;
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
        data: publiseringsinfo,
    } = useHentPubliseringsinfo()
    const {
        data: historiskStatistikk
    } = useHentHistoriskstatistikk(orgnr)

    if (!historiskStatistikk || !publiseringsinfo) {
        return null;
    }

    const detSomSkalVises =
        historiskStatistikk.landsstatistikk.statistikk
            .sort(sorterKvartalStigende)
            .map(
                statistikk => {
                    const virksomhetverdi = historiskStatistikk.virksomhetsstatistikk.statistikk
                        .find(datapunkt => {
                            return datapunkt.årstall === statistikk.årstall && datapunkt.kvartal === statistikk.kvartal
                        });
                    const næringverdi = historiskStatistikk.næringsstatistikk.statistikk
                        .find(datapunkt => {
                            return datapunkt.årstall === statistikk.årstall && datapunkt.kvartal === statistikk.kvartal
                        });
                    const bransjeverdi = historiskStatistikk.bransjestatistikk.statistikk
                        .find(datapunkt => {
                            return datapunkt.årstall === statistikk.årstall && datapunkt.kvartal === statistikk.kvartal
                        });
                    const sektorverdi = historiskStatistikk.sektorstatistikk.statistikk
                        .find(datapunkt => {
                            return datapunkt.årstall === statistikk.årstall && datapunkt.kvartal === statistikk.kvartal
                        });
                    return {
                        name: `${kvartalSomTekst(statistikk.årstall, statistikk.kvartal)}`,
                        land: statistikk.sykefraværsprosent,
                        sektor: sektorverdi ? sektorverdi.sykefraværsprosent : null,
                        næring: næringverdi ? næringverdi.sykefraværsprosent : null,
                        bransje: bransjeverdi ? bransjeverdi.sykefraværsprosent : null,
                        virksomhet: virksomhetverdi && !virksomhetverdi.maskert ? virksomhetverdi.sykefraværsprosent : null,
                    }
                }
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
                <br />
                <LegendMedToggles />
            </div>

            <ResponsiveContainer minHeight={400}>
                <LineChart
                    data={detSomSkalVises}
                    role="img"
                    aria-label="Graf som viser sykefraværet over tid."
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#C6C2BF" />

                    {Object.entries(graflinjer).map(([key, value]) => (
                        <Line type="monotone"
                              key={key}
                              dataKey={key}
                              stroke={value.farge}
                              strokeWidth={linjebredde}
                              isAnimationActive={false}
                              dot={
                                  <Symbols
                                      type={value.symbol}
                                      size={dotStrl}
                                      fill={value.farge}
                                  />
                              }
                        />
                    ))}

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
