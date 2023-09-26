import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import React from "react";

export const Historiskstatistikk = () => {
    const data = [{
        name: "2023-2",
        value: 12.4
    }, {
        name: "2023-1",
        value: 10.0
    }]
    return (
        <ResponsiveContainer minHeight={400}>
            <LineChart
                data={data}
                role="img"
                title="Graf som viser sykefraværet over tid. Kan også sees som tabell."
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#C6C2BF" />
                <Line type="monotone" dataKey="value" stroke="#000000" />
                <XAxis dataKey="name"/>
                <YAxis/>
            </LineChart>
        </ResponsiveContainer>
    )
}
