import { Symbols } from "recharts";
import React from "react";

interface Props {
    size: number;
    fill: string;
    className?: string;
}

export const SymbolSvg = ({ size, fill }: Props) => {
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
                type={'circle'}
            />
        </svg>
    );
};
