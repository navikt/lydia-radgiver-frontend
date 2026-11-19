import React from "react";
import { HGrid } from "@navikt/ds-react";
import { Sykefraværsmål } from "./målskjema";
import { Måloversiktdel } from "./Måloversikt";
import { Sykefraværsmålkort } from "./Sykefraværsmålkort";

export function Sykefraværsmåloversikt({
    sykefraværsmål,
    onRediger,
}: {
    sykefraværsmål: Sykefraværsmål[];
    onRediger?: () => void;
}) {
    const idPrefiks = React.useId();
    return (
        <Måloversiktdel
            tittel="Mål for sykefraværet"
            overskriftId="sykefravaersmaal-overskrift"
            onRediger={onRediger}
        >
            <HGrid columns={{ xs: 1, md: 2, lg: 3 }} gap="space-16">
                {sykefraværsmål.map((m) => (
                    <Sykefraværsmålkort
                        key={m.type}
                        idPrefiks={`${idPrefiks}-${m.type}`}
                        mål={m}
                    />
                ))}
            </HGrid>
        </Måloversiktdel>
    );
}
