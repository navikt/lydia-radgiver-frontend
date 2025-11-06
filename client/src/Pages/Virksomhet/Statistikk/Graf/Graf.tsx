import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Symbols,
    XAxis,
    YAxis,
} from "recharts";
import { Checkbox, CheckboxGroup } from "@navikt/ds-react";

import { sorterKvartalStigende } from "../../../../util/sortering";
import { graphTooltip } from "./GraphTooltip";
import { Grafer, graflinjer, grafrekkefølge } from "./graflinjer";
import { useState } from "react";
import { SymbolSvg } from "./SymbolSvg";
import { loggGraflinjeEndringer } from "../../../../util/analytics-klient";
import { HistoriskStatistikk } from "../../../../domenetyper/historiskstatistikk";
import styles from "./graf.module.scss";

const kvartalSomTekst = (årstall: number, kvartal: number) =>
    årstall + ", " + kvartal + ". kvartal";

export default function Graf({
    historiskStatistikk,
}: {
    historiskStatistikk: HistoriskStatistikk;
}) {
    const [linjerSomSkalVises, setLinjerSomSkalVises] = useState([
        Grafer.VIRKSOMHET,
        Grafer.NÆRING,
        Grafer.BRANSJE,
        Grafer.SEKTOR,
        Grafer.LAND,
    ]);

    const detSomSkalVises = historiskStatistikk.landsstatistikk.statistikk
        .sort(sorterKvartalStigende)
        .map((statistikk) => {
            const virksomhetverdi =
                historiskStatistikk.virksomhetsstatistikk.statistikk.find(
                    (datapunkt) => {
                        return (
                            datapunkt.årstall === statistikk.årstall &&
                            datapunkt.kvartal === statistikk.kvartal
                        );
                    },
                );
            const næringverdi =
                historiskStatistikk.næringsstatistikk.statistikk.find(
                    (datapunkt) => {
                        return (
                            datapunkt.årstall === statistikk.årstall &&
                            datapunkt.kvartal === statistikk.kvartal
                        );
                    },
                );
            const bransjeverdi =
                historiskStatistikk.bransjestatistikk.statistikk.find(
                    (datapunkt) => {
                        return (
                            datapunkt.årstall === statistikk.årstall &&
                            datapunkt.kvartal === statistikk.kvartal
                        );
                    },
                );
            const sektorverdi =
                historiskStatistikk.sektorstatistikk.statistikk.find(
                    (datapunkt) => {
                        return (
                            datapunkt.årstall === statistikk.årstall &&
                            datapunkt.kvartal === statistikk.kvartal
                        );
                    },
                );
            return {
                name: `${kvartalSomTekst(statistikk.årstall, statistikk.kvartal)}`,
                [Grafer.LAND]: statistikk.sykefraværsprosent,
                [Grafer.SEKTOR]: sektorverdi
                    ? sektorverdi.sykefraværsprosent
                    : null,
                [Grafer.NÆRING]: næringverdi
                    ? næringverdi.sykefraværsprosent
                    : null,
                [Grafer.BRANSJE]: bransjeverdi
                    ? bransjeverdi.sykefraværsprosent
                    : null,
                [Grafer.VIRKSOMHET]:
                    virksomhetverdi && !virksomhetverdi.maskert
                        ? virksomhetverdi.sykefraværsprosent
                        : null,
            };
        });

    const førstekvartalIHvertÅr = detSomSkalVises
        .filter((it) => {
            return it.name.includes("1. kvartal");
        })
        .map((it) => it.name);

    const legendTekst = (navnTilStatistikk: Grafer) => {
        switch (navnTilStatistikk) {
            case Grafer.VIRKSOMHET:
                return `: ${historiskStatistikk.virksomhetsstatistikk.beskrivelse}`;
            case Grafer.NÆRING:
                return `: ${historiskStatistikk.næringsstatistikk.beskrivelse}`;
            case Grafer.BRANSJE:
                return `: ${historiskStatistikk.bransjestatistikk.beskrivelse}`;
            case Grafer.SEKTOR:
                return `: ${historiskStatistikk.sektorstatistikk.beskrivelse}`;
            case Grafer.LAND:
                return "";
        }
    };

    const endringIValgteLinjer = (valgteLinjer: string[]) => {
        loggGraflinjeEndringer(valgteLinjer);
        setLinjerSomSkalVises(valgteLinjer as Grafer[]);
    };
    return (
        <>
            <div>
                <CheckboxGroup
                    legend="Velg statistikk som skal vises i grafen"
                    value={linjerSomSkalVises}
                    onChange={endringIValgteLinjer}
                >
                    {Object.entries(graflinjer).map(([key, value]) => {
                        if (
                            key === Grafer.BRANSJE &&
                            historiskStatistikk.bransjestatistikk.statistikk
                                .length === 0
                        ) {
                            return null;
                        }
                        return (
                            <Checkbox value={key} key={key}>
                                <div className={styles.symbolOgTekstWrapper}>
                                    <SymbolSvg
                                        className={styles.legendSymbol}
                                        size={18}
                                        fill={value.farge}
                                        symbol={value.symbol}
                                    />
                                    {value.navn}
                                    {legendTekst(key as Grafer)}
                                </div>
                            </Checkbox>
                        );
                    })}
                </CheckboxGroup>
            </div>
            <ResponsiveContainer minHeight={400}>
                <LineChart
                    data={detSomSkalVises}
                    role="img"
                    aria-label="Graf som viser sykefraværet over tid."
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#C6C2BF" />

                    {Object.entries(graflinjer)
                        .sort(grafrekkefølge)
                        .filter(([key]) =>
                            linjerSomSkalVises.includes(key as Grafer),
                        )
                        .map(([key, value]) => (
                            <Line
                                type="monotone"
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
                    <YAxis tickFormatter={(value) => `${value} %`} />
                    {graphTooltip()}
                </LineChart>
            </ResponsiveContainer>
        </>
    );
}
