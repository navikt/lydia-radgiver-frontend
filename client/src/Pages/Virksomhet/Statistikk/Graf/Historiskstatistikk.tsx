import styled from "styled-components";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Symbols, XAxis, YAxis } from "recharts";
import { BodyShort, Heading } from "@navikt/ds-react";
import { SymbolSvg } from "./SymbolSvg";
import { useHentHistoriskstatistikk, useHentPubliseringsinfo } from "../../../../api/lydia-api";
import { sorterKvartalStigende } from "../../../../util/sortering";
import { graphTooltip } from "./GraphTooltip";
import { Kvartal, lagKvartaler } from "../../../../domenetyper/kvartal";
import { graflinjer } from "./graflinjer";

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

export const FEM_ÅR_TILBAKE_I_TID_I_ANTALL_KVARTALER = 20;
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

    interface Datapunkt {
        name: string;
        virksomhet: number | null;
    }

    const alleKvartalerTilgjengelig: Kvartal[] = lagKvartaler(
        { årstall: publiseringsinfo.fraTil.til.årstall, kvartal: publiseringsinfo.fraTil.til.kvartal },
        FEM_ÅR_TILBAKE_I_TID_I_ANTALL_KVARTALER
    ).sort(sorterKvartalStigende)

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
                const landverdi = historiskStatistikk.landsstatistikk.statistikk
                    .find(datapunkt => {
                        return datapunkt.årstall === statistikk.årstall && datapunkt.kvartal === statistikk.kvartal
                    });
                return {
                    name: `${kvartalSomTekst(statistikk.årstall, statistikk.kvartal)}`,
                    virksomhet: statistikk.maskert ? null : statistikk.sykefraværsprosent,
                    næring: næringverdi ? næringverdi.sykefraværsprosent : null,
                    bransje: bransjeverdi ? bransjeverdi.sykefraværsprosent : null,
                    sektor: sektorverdi ? sektorverdi.sykefraværsprosent : null,
                    land: landverdi ? landverdi.sykefraværsprosent : null,
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
                    <SymbolSvg
                        size={dotStrl}
                        fill={graflinjer["virksomhet"].farge}
                        symbol={graflinjer["virksomhet"].symbol}
                    />
                    <BodyShort>
                        Virksomhet
                    </BodyShort>
                    <SymbolSvg size={dotStrl}
                               fill={graflinjer["næring"].farge}
                               symbol={graflinjer["næring"].symbol}
                    />
                    <BodyShort>
                        Næring
                    </BodyShort>
                    <SymbolSvg size={dotStrl}
                               fill={graflinjer["bransje"].farge}
                               symbol={graflinjer["bransje"].symbol}
                    />
                    <BodyShort>
                        Bransjeprogram
                    </BodyShort>
                    <SymbolSvg size={dotStrl}
                               fill={graflinjer["sektor"].farge}
                               symbol={graflinjer["sektor"].symbol}
                    />
                    <BodyShort>
                        Sektor
                    </BodyShort>
                    <SymbolSvg size={dotStrl}
                               fill={graflinjer["land"].farge}
                               symbol={graflinjer["land"].symbol}
                    />
                    <BodyShort>
                        Land
                    </BodyShort>
                </Legend>
            </div>

            <ResponsiveContainer minHeight={400}>
                <LineChart
                    data={detSomSkalVises}
                    role="img"
                    aria-label="Graf som viser sykefraværet over tid."
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#C6C2BF" />
                    <Line type="monotone"
                          dataKey="virksomhet"
                          stroke={graflinjer["virksomhet"].farge}
                          strokeWidth={linjebredde}
                          isAnimationActive={false}
                          dot={
                              <Symbols
                                  type={graflinjer["virksomhet"].symbol}
                                  size={dotStrl}
                                  fill={graflinjer["virksomhet"].farge}
                              />
                          }
                    />
                    <Line type="monotone"
                          dataKey="næring"
                          stroke={graflinjer["næring"].farge}
                          strokeWidth={linjebredde}
                          isAnimationActive={false}
                          dot={
                              <Symbols
                                  type={graflinjer["næring"].symbol}
                                  size={dotStrl}
                                  fill={graflinjer["næring"].farge}
                              />
                          }
                    />
                    <Line type="monotone"
                          dataKey="bransje"
                          stroke={graflinjer["bransje"].farge}
                          strokeWidth={linjebredde}
                          isAnimationActive={false}
                          dot={
                              <Symbols
                                  type={graflinjer["bransje"].symbol}
                                  size={dotStrl}
                                  fill={graflinjer["bransje"].farge}
                              />
                          }
                    />
                    <Line type="monotone"
                          dataKey="sektor"
                          stroke={graflinjer["sektor"].farge}
                          strokeWidth={linjebredde}
                          isAnimationActive={false}
                          dot={
                              <Symbols
                                  type={graflinjer["sektor"].symbol}
                                  size={dotStrl}
                                  fill={graflinjer["sektor"].farge}
                              />
                          }
                    />
                    <Line
                        type="monotone"
                        dataKey="land"
                        stroke={graflinjer["land"].farge}
                        strokeWidth={linjebredde}
                        isAnimationActive={false}
                        dot={
                            <Symbols
                                type={graflinjer["land"].symbol}
                                size={dotStrl}
                                fill={graflinjer["land"].farge}
                            />
                        }
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
