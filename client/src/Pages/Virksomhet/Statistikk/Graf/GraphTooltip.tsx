import { Tooltip } from "recharts";
import { SymbolSvg } from "./SymbolSvg";
import { Grafer, graflinjer } from "./graflinjer";
import styles from "./graf.module.scss";

export function graphTooltip() {
    return (
        <Tooltip
            itemSorter={(item) => graflinjer[item.dataKey as Grafer].rekkefølge}
            formatter={(
                value: number | undefined,
                name: string | undefined,
            ) => [
                <span
                    className={styles.graphTooltipItemWrapper}
                    key={`tooltip-${name}`}
                >
                    <SymbolSvg
                        className={styles.ikon}
                        size={30}
                        fill={graflinjer?.[name || ""]?.farge}
                        symbol={graflinjer?.[name || ""]?.symbol}
                    />
                    <div className={styles.navnOgVerdi}>
                        <span className={styles.navn}>
                            {graflinjer?.[name || ""]?.navn}
                        </span>
                        <span className={styles.verdi}>{value + " %"}</span>
                    </div>
                </span>,
            ]}
            contentStyle={{
                border: "2px solid #254B6D",
                borderRadius: "0.25rem",
            }}
            labelStyle={{ paddingBottom: "0.5rem" }}
            itemStyle={{ paddingTop: 0, paddingBottom: 0 }}
            cursor={{ stroke: "#254B6D", strokeWidth: 3, type: "dot" }}
        />
    );
}
