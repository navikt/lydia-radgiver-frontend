import { Symbols } from "recharts";
import React from "react";
import { GrafFarger } from "../../../../styling/farger";

export type GrafSymboler =
    | "circle"
    | "cross"
    | "diamond"
    | "square"
    | "star"
    | "triangle"
    | "wye"

interface Props {
    size: number;
    fill: GrafFarger;
    symbol: GrafSymboler;
    className?: string;
}

export const SymbolSvg = ({ size, fill, symbol }: Props) => {
    const halfSize = size / 2;

    return (
        <svg
            width={size}
            height={size}
            viewBox={'0 0 ' + size + ' ' + size}
            aria-hidden={true}
        >
            <Symbols
                fill={fill}
                cx={halfSize}
                cy={halfSize}
                size={size * 3.75}
                sizeType="area"
                type={symbol}
            />
        </svg>
    );
};
