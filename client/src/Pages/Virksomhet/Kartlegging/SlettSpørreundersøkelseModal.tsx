import React from "react";
import { BekreftValgModal } from "@/components/Modal/BekreftValgModal";
import { Spørreundersøkelse } from "@/domenetyper/spørreundersøkelse";
import { lokalDatoMedKlokkeslett } from "@/util/dato";

export function SlettSpørreundersøkelseModal({
    spørreundersøkelse,
    erModalÅpen,
    lukkModal,
    slettSpørreundersøkelsen,
}: {
    spørreundersøkelse: Spørreundersøkelse;
    erModalÅpen: boolean;
    lukkModal: () => void;
    slettSpørreundersøkelsen: () => void;
}) {
    const penskrevetType =
        spørreundersøkelse.type === "BEHOVSVURDERING"
            ? "Behovsvurdering"
            : "Evaluering";

    return (
        <BekreftValgModal
            onConfirm={slettSpørreundersøkelsen}
            onCancel={() => lukkModal()}
            åpen={erModalÅpen}
            title={`Er du sikker på at du vil slette denne ${spørreundersøkelse.type.toLowerCase()}en?`}
            description={`${penskrevetType} opprettet ${lokalDatoMedKlokkeslett(spørreundersøkelse.opprettetTidspunkt)}.`}
        />
    );
}
