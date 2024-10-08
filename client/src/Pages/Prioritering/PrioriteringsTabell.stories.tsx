import { Meta } from "@storybook/react";
import { PrioriteringsTabell } from "./PrioriteringsTabell";
import { sykefraværsstatistikkMock } from "./mocks/sykefraværsstatistikkMock";
import { useState } from "react";
import { SortState } from "@navikt/ds-react";

export default {
    title: "Prioritering/Prioriteringstabell",
    component: PrioriteringsTabell,
} as Meta<typeof PrioriteringsTabell>;

function repeatArray<T>(arr: T[], repeats: number): T[] {
    return Array.from({ length: repeats }, () => arr).flat();
}

export const Hovedstory = () => {
    const sykefraværsstatistikk = repeatArray(sykefraværsstatistikkMock, 5);
    const antallPerSide = 5;
    const [side, setSide] = useState(1);
    const [sortering, setSortering] = useState<SortState>({
        direction: "descending",
        orderBy: "tapte_dagsverk",
    });

    return (
        <PrioriteringsTabell
            virksomhetsoversiktListe={sykefraværsstatistikk.slice(
                (side - 1) * antallPerSide,
                side * antallPerSide,
            )}
            endreSide={(side) => {
                setSide(side);
            }}
            side={side}
            sortering={sortering}
            endreSortering={(sortering) => {
                setSortering(sortering);
                setSide(1);
            }}
            totaltAntallTreff={5}
        />
    );
};
