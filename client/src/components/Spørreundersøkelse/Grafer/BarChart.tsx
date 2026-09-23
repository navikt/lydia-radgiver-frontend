import React from "react";
import {
    Chart,
    type ChartOptions,
    type HighchartsReactRefObject,
} from "@highcharts/react";
import { Accessibility } from "@highcharts/react/modules/Accessibility";
import { SpørsmålResultat } from "../../../domenetyper/spørreundersøkelseResultat";
import { useSpørsmålMedSorterteSvaralternativer } from "../../../util/sorterSvaralternativer";
import { Heading } from "@navikt/ds-react";
import styles from "./grafer.module.scss";

export default function BarChart({
    spørsmål,
    erIEksportMode = false,
    horizontal = false,
    farge = "var(--ax-accent-600)",
}: {
    spørsmål: SpørsmålResultat;
    erIEksportMode?: boolean;
    horizontal?: boolean;
    farge?: string;
}) {
    const chartComponentRef = React.useRef<HighchartsReactRefObject>(null);
    const spørsmålMedSorterteAlternativer =
        useSpørsmålMedSorterteSvaralternativer(spørsmål);

    const options = React.useMemo(
        () =>
            genererChartOptionsFraSpørsmålOgSvar(
                spørsmålMedSorterteAlternativer,
                erIEksportMode,
                horizontal,
                farge,
            ),
        [spørsmålMedSorterteAlternativer],
    );

    if (spørsmål.svarListe.some((svar) => svar.antallSvar > 0) === false) {
        return (
            <Heading
                level="4"
                size="small"
                spacing
                className={styles.tomGrafTittel}
            >
                {spørsmål.tekst}
            </Heading>
        );
    }

    return (
        <Chart
            options={options}
            chartConstructor={"chart"}
            ref={chartComponentRef}
        >
            <Accessibility />
        </Chart>
    );
}

function genererChartOptionsFraSpørsmålOgSvar(
    spørsmål: SpørsmålResultat,
    erIEksportMode: boolean,
    horizontal: boolean,
    farge: string,
): ChartOptions {
    return {
        palette: {
            colorScheme: "light",
        },
        chart: {
            type: horizontal ? "bar" : "column",
        },
        title: {
            text: spørsmål.tekst,
            align: "left",
            margin: 35,
        },
        subtitle: {
            text: spørsmål.flervalg ? "(flere valg er mulig)" : undefined,
            style: {
                textAlign: "left",
            },
        },
        plotOptions: {
            series: {
                animation: !erIEksportMode,
            },
            column: {
                borderWidth: 2,
                borderRadius: 0,
                crisp: true,
            },
        },
        series: [
            {
                type: "column",
                name: "Antall svar",
                data: spørsmål.svarListe.map((svar) =>
                    svar.antallSvar > 0
                        ? {
                              y: svar.antallSvar,
                              color: farge,
                          }
                        : null,
                ),
            },
        ],
        xAxis: {
            categories: spørsmål.svarListe.map((svar) => svar.tekst),
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: "Antall svar",
            },
        },
        credits: {
            enabled: false,
        },
        legend: {
            enabled: false,
        },
    };
}
