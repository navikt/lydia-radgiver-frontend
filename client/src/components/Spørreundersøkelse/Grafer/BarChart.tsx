import React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { SpørsmålResultat } from "../../../domenetyper/spørreundersøkelseResultat";
import { useSpørsmålMedSorterteSvaralternativer } from "../../../util/sorterSvaralternativer";
import "highcharts/modules/accessibility";

export default function BarChart({
    spørsmål,
    erIEksportMode = false,
    horizontal = false,
    farge = "var(--a-blue-500)",
}: {
    spørsmål: SpørsmålResultat;
    erIEksportMode?: boolean;
    horizontal?: boolean;
    farge?: string;
}) {
    const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null);
    const spørsmålMedSorterteAlternativer = useSpørsmålMedSorterteSvaralternativer(spørsmål);

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

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            constructorType={"chart"}
            ref={chartComponentRef}
        />
    );
}

function genererChartOptionsFraSpørsmålOgSvar(
    spørsmål: SpørsmålResultat,
    erIEksportMode: boolean,
    horizontal: boolean,
    farge: string,
): Highcharts.Options {
    return {
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
            }
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
