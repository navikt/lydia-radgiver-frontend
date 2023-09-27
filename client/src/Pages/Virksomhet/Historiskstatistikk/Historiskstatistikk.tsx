import { CartesianGrid, Line, LineChart, ResponsiveContainer, Symbols, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";
import { HistoriskStatistikk } from "../../../domenetyper/historiskstatistikk";
import { BodyShort, Heading } from "@navikt/ds-react";
import styled from "styled-components";
import { tabInnholdStyling } from "../../../styling/containere";
import { SymbolSvg } from "./SymbolSvg";

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  ${tabInnholdStyling};
`;
const Legend = styled.div`
  margin-top: 1rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
 `;

interface HistoriskStatistikkProps {
    historiskStatistikk: HistoriskStatistikk
}

const linjebredde = 2;
const dotStrl = 40;

export const Historiskstatistikk = ({ historiskStatistikk }: HistoriskStatistikkProps) => {

    const detSomSkalVises = historiskStatistikk.virksomhetsstatistikk.statistikk
        .sort((s1, s2) => {
            if ((s1.årstall - s2.årstall) === 0) {
                return s1.kvartal - s2.kvartal
            } else {
                return s1.årstall - s2.årstall
            }
        })
        .map(
            statistikk => {
                return {
                    name: `${statistikk.årstall}-${statistikk.kvartal}`,
                    value: statistikk.sykefraværsprosent
                }
            }
        )

    return (
        <Container>
            <div>
                <Heading spacing={true} size="large">Historisk statistikk</Heading>
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
                          dataKey="value"
                          stroke="red"
                          strokeWidth={linjebredde}
                          isAnimationActive={false}
                          dot={<Symbols type={"circle"} size={dotStrl} fill={"red"} />}
                    />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            </ResponsiveContainer>
        </Container>
    )
}
