import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { lokalDatoMedKlokkeslett } from "../../../util/dato";
import React from "react";
import { useSpørreundersøkelseType } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";

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
    const type = useSpørreundersøkelseType();

    return (
        <BekreftValgModal
            onConfirm={slettSpørreundersøkelsen}
            onCancel={() => lukkModal()}
            åpen={erModalÅpen}
            title={`Er du sikker på at du vil slette denne ${type.toLowerCase()}en?`}
            description={`${type}gen som slettes er "${type} opprettet ${lokalDatoMedKlokkeslett(spørreundersøkelse.opprettetTidspunkt)}".`}
        />
    );
}
