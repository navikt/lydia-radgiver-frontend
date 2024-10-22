import React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type SpørsmålMedSvarDTO = {
    spørsmålId: string;
    tekst: string;
    flervalg: boolean;
    svarListe: { tekst: string; svarId: string; antallSvar: number }[];
};

export default function BarChart({
    spørsmål,
    erIEksportMode = false,
    horizontal = false,
}: {
    spørsmål: SpørsmålMedSvarDTO;
    erIEksportMode?: boolean;
    horizontal?: boolean;
}) {
    const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null);

    const options = React.useMemo(
        () => genererChartOptionsFraSpørsmålOgSvar(spørsmål, erIEksportMode, horizontal),
        [spørsmål],
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
    spørsmål: SpørsmålMedSvarDTO,
    erIEksportMode: boolean,
    horizontal: boolean,
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
            align: "left",
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
                            color: "var(--a-blue-500)",
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
