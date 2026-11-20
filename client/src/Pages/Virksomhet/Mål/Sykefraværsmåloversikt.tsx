import React from "react";
import { HGrid } from "@navikt/ds-react";
import { Sykefraværsmål } from "./målskjema";
import { Måltypekort } from "./Måloversikt";
import { Sykefraværsmålkort } from "./Sykefraværsmålkort";

export function Sykefraværsmåloversikt({
    sykefraværsmål,
    onÅpneDialog,
    deaktivert,
}: {
    sykefraværsmål: Sykefraværsmål[];
    onÅpneDialog?: () => void;
    deaktivert: boolean;
}) {
    const idPrefiks = React.useId();
    return (
        <Måltypekort
            tittel="Mål for sykefraværet"
            beskrivelse="Sett mål for reduksjon av sykefraværet"
            leggTilTekst="Mål for sykefraværet"
            harMål={sykefraværsmål.length > 0}
            onÅpneDialog={onÅpneDialog}
            deaktivert={deaktivert}
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
        </Måltypekort>
    );
}
