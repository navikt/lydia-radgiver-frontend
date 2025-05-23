import { Tooltip } from "recharts";
import styled from "styled-components";
import { SymbolSvg } from "./SymbolSvg";
import { Grafer, graflinjer } from "./graflinjer";
import { NavFarger } from "../../../../styling/farger";

const TooltipItemWrapper = styled.span`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const NavnOgVerdi = styled.div`
    font-size: 1rem;
    color: ${NavFarger.gray900};
    align-content: center;
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 0.25rem;
`;

const Navn = styled.span`
    font-weight: bold;
    color: ${NavFarger.gray900};
    margin-right: 0.75rem;

    text-transform: capitalize;
`;

const Verdi = styled.span`
    color: ${NavFarger.gray900};
    align-content: space-around;
`;

const Ikon = styled(SymbolSvg)`
    margin-right: 0.5rem;
`;

export function graphTooltip() {
    return (
        <Tooltip
            itemSorter={(item) => graflinjer[item.dataKey as Grafer].rekkefølge}
            formatter={(value: number, name: string) => [
                <TooltipItemWrapper key={`tooltip-${name}`}>
                    <Ikon
                        size={30}
                        fill={graflinjer[name].farge}
                        symbol={graflinjer[name].symbol} />
                    <NavnOgVerdi>
                        <Navn>{graflinjer[name].navn}</Navn>
                        <Verdi>{value + " %"}</Verdi>
                    </NavnOgVerdi>
                </TooltipItemWrapper>,
            ]}
            contentStyle={{
                border: "2px solid #254B6D",
                borderRadius: "0.25rem",
            }}
            labelStyle={{ paddingBottom: "0.5rem" }}
            itemStyle={{ paddingTop: 0, paddingBottom: 0 }}
            cursor={{ stroke: "#254B6D", strokeWidth: 3, type: "dot" }} />
    );
}
