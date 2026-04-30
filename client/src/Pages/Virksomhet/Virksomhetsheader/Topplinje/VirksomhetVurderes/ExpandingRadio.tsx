import { Box, Radio } from "@navikt/ds-react";
import React from "react";

export function ExpandingRadio({
    value,
    label,
    selected,
    children,
}: {
    value: string;
    label: string;
    selected?: string;
    children: React.ReactNode;
}) {
    return (
        <Box
            padding="space-16"
            borderRadius="xlarge"
            background="surface-alt-2-subtle"
        >
            <Radio value={value}>{label}</Radio>
            {selected === value && (
                <Box paddingInline="space-32">{children}</Box>
            )}
        </Box>
    );
}
