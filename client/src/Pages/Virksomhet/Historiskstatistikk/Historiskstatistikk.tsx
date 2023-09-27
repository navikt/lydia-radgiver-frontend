import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";
import { HistoriskStatistikk } from "../../../domenetyper/historiskstatistikk";

interface Props {
    historiskStatistikk: HistoriskStatistikk
}

export const Historiskstatistikk = ({ historiskStatistikk }: Props) => {

    const detSomSkalVises = historiskStatistikk.virksomhetsstatistikk.statistikk.map(
        statistikk => {
            return {
                name: `${statistikk.årstall}-${statistikk.kvartal}`,
                value: statistikk.sykefraværsprosent
            }
        }
    )


    return (
        <ResponsiveContainer minHeight={400}>
            <LineChart
                data={detSomSkalVises}
                role="img"
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#C6C2BF"/>
                <Line type="monotone" dataKey="value" stroke="#000000"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
            </LineChart>
        </ResponsiveContainer>
    )
}
