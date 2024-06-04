import React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";


type SpørsmålMedSvarDTO = {
  spørsmålId: string;
  tekst: string;
  flervalg: boolean;
  svarListe: { tekst: string; svarId: string; antallSvar: number }[];
};

export default function PieChart({
  spørsmål,
}: {
  spørsmål: SpørsmålMedSvarDTO;
}) {
  const chartComponentRef = React.useRef<HighchartsReact.RefObject>(null);

  const options = React.useMemo(
    () => genererChartOptionsFraSpørsmålOgSvar(spørsmål),
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
): Highcharts.Options {
  const farger = [
    { bakgrunn: "var(--a-data-surface-2)", border: undefined },
    {
      bakgrunn: "var(--a-data-surface-2-subtle)",
      border: "var(--a-data-border-2)",
    },
    { bakgrunn: "var(--a-data-surface-3)", border: undefined },
    {
      bakgrunn: "var(--a-data-surface-3-subtle)",
      border: "var(--a-data-border-3)",
    },
    { bakgrunn: "var(--a-data-surface-6)", border: undefined },
    {
      bakgrunn: "var(--a-data-surface-6-subtle)",
      border: "var(--a-data-border-6)",
    },
    { bakgrunn: "var(--a-data-surface-5)", border: undefined },
    {
      bakgrunn: "var(--a-data-surface-5-subtle)",
      border: "var(--a-data-border-5)",
    },
    { bakgrunn: "var(--a-data-surface-4)", border: undefined },
    {
      bakgrunn: "var(--a-data-surface-4-subtle)",
      border: "var(--a-data-border-4)",
    },
  ];
  return {
    chart: {
      type: "pie",
    },
    title: {
      text: spørsmål.tekst,
    },
    subtitle: {
      text: spørsmål.flervalg ? "(flere valg er mulig)" : undefined,
    },
    plotOptions: {
      pie: {
        borderWidth: 2,
        linecap: "square",
        borderRadius: 0,
        slicedOffset: 6,
        crisp: true,
        ignoreHiddenPoint: true,
      },
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: [
          {
            enabled: true,
            // @ts-expect-error The type is wrong
            distance: 20,
          },
          {
            enabled: true,
            // @ts-expect-error The type is wrong
            distance: -40,
            format: "{y}",
            style: {
              fontSize: "1.2em",
              textOutline: "none",
              opacity: 0.7,
            },
            filter: {
              operator: ">",
              property: "percentage",
              value: 10,
            },
          },
        ],
      },
    },
    series: [
      {
        type: "pie",
        name: "Antall svar",
        data: spørsmål.svarListe.map((svar, index) =>
          svar.antallSvar > 0
            ? {
                name: svar.tekst,
                y: svar.antallSvar,
                color: farger[index].bakgrunn,
                borderColor: farger[index].border ?? farger[index].bakgrunn,
              }
            : null,
        ),
      },
    ],
    credits: {
      enabled: false,
    },
  };
}
