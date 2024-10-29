import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";
import React from "react";

export function SlettBehovsvurderingModal({
    behovsvurdering,
    erModalÅpen,
    lukkModal,
    slettSpørreundersøkelsen,
}: {
    behovsvurdering: Spørreundersøkelse;
    erModalÅpen: boolean;
    lukkModal: () => void;
    slettSpørreundersøkelsen: () => void;
}) {
    return (
        <BekreftValgModal
            onConfirm={slettSpørreundersøkelsen}
            onCancel={() => lukkModal()}
            åpen={erModalÅpen}
            title="Er du sikker på at du vil slette denne behovsvurderingen?"
            description={`Behovsvurderingen som slettes er "Behovsvurdering opprettet ${lokalDatoMedKlokkeslett(behovsvurdering.opprettetTidspunkt)}".`}
        />
    );
}
