import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { BodyLong } from "@navikt/ds-react";
import React from "react";
import { useSpørreundersøkelseType } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";

import styles from "./fullførSpørreundersøkelseModal.module.scss";
export function FullførSpørreundersøkelseModal({
    erModalÅpen,
    lukkModal,
    harNokDeltakere,
    fullførSpørreundersøkelse,
}: {
    erModalÅpen: boolean;
    harNokDeltakere: boolean;
    lukkModal: () => void;
    fullførSpørreundersøkelse: () => void;
}) {
    const type = useSpørreundersøkelseType();
    return (
        <BekreftValgModal
            onConfirm={fullførSpørreundersøkelse}
            onCancel={() => lukkModal()}
            åpen={erModalÅpen}
            title={`Er du sikker på at du vil fullføre ${type.toLowerCase()}en?`}
        >
            {harNokDeltakere && (
                <div className={styles.ekstraInfoTekstModal}>
                    <BodyLong>
                        Minst 3 deltakere må ha svart for å kunne vise
                        resultater.
                    </BodyLong>
                </div>
            )}
        </BekreftValgModal>
    );
}
