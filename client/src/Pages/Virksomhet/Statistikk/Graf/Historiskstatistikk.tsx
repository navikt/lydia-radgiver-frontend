import styled from "styled-components";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Symbols, XAxis, YAxis } from "recharts";
import { BodyShort, Checkbox, CheckboxGroup, Heading } from "@navikt/ds-react";
import { useHentHistoriskstatistikk, useHentPubliseringsinfo } from "../../../../api/lydia-api";
import { sorterKvartalStigende } from "../../../../util/sortering";
import { graphTooltip } from "./GraphTooltip";
import { graflinjer } from "./graflinjer";
import { useState } from "react";
import { SymbolSvg } from "./SymbolSvg";

const Container = styled.div`
  padding-top: 4rem;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 3rem;
`;

const SymbolOgTekstWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LegendSymbol = styled(SymbolSvg)`
  margin-right: 0.5rem;
`;

const kvartalSomTekst = (årstall: number, kvartal: number) =>
    årstall + ', ' + kvartal + '. kvartal';

interface HistoriskStatistikkProps {
    orgnr: string;
}

export const Historiskstatistikk = ({ orgnr }: HistoriskStatistikkProps) => {
    const [linjerSomSkalVises, setLinjerSomSkalVises] = useState(["virksomhet", "bransje", "næring"]);
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
                <CheckboxGroup
                    legend="Velg statistikk som skal vises i grafen"
                    value={linjerSomSkalVises}
                    onChange={setLinjerSomSkalVises}
                >
                    {Object.entries(graflinjer).map(([key, value]) =>
                        (<Checkbox value={key} key={key}>
                            <SymbolOgTekstWrapper>
                                <LegendSymbol
                                    size={18}
                                    fill={value.farge}
                                    symbol={value.symbol}
                                />
                                {value.navn}
                            </SymbolOgTekstWrapper>
                        </Checkbox>))
                    }
                </CheckboxGroup>
            </div>

            <ResponsiveContainer minHeight={400}>
                <LineChart
                    data={detSomSkalVises}
                    role="img"
                    aria-label="Graf som viser sykefraværet over tid."
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#C6C2BF" />

                    {Object.entries(graflinjer).filter(([key]) => linjerSomSkalVises.includes(key)).map(([key, value]) => (
                        <Line type="monotone"
                              key={key}
                              dataKey={key}
                              stroke={value.farge}
                              strokeWidth={2}
                              isAnimationActive={false}
                              dot={
                                  <Symbols
                                      type={value.symbol}
                                      size={40}
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
