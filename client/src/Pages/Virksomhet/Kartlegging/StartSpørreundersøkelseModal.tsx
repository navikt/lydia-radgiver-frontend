import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { BekreftValgModal } from "../../../components/Modal/BekreftValgModal";
import { åpneSpørreundersøkelseINyFane } from "../../../util/navigasjon";
import { BodyShort, List } from "@navikt/ds-react";
import React from "react";
import { useSpørreundersøkelseType } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";

export function StartSpørreundersøkelseModal({
    spørreundersøkelse,
    erModalÅpen,
    lukkModal,
    startSpørreundersøkelsen,
}: {
    spørreundersøkelse: Spørreundersøkelse;
    erModalÅpen: boolean;
    lukkModal: () => void;
    startSpørreundersøkelsen: () => void;
}) {
    const type = useSpørreundersøkelseType();
    return (
        <BekreftValgModal
            jaTekst={"Start"}
            onConfirm={() => {
                startSpørreundersøkelsen();
                åpneSpørreundersøkelseINyFane(
                    spørreundersøkelse.id,
                    "OPPRETTET",
                );
                lukkModal();
            }}
            onCancel={() => lukkModal()}
            åpen={erModalÅpen}
            title={`Start ${type.toLowerCase()}`}
        >
            <br />
            <BodyShort weight={"semibold"}>
                Før du starter {type.toLowerCase()}en, husk at:
            </BodyShort>
            <List>
                <List.Item>
                    Deltakere må ha telefon med kamera for å scanne QR-koden.
                </List.Item>
                <List.Item>Det må være minst tre deltakere</List.Item>
                <List.Item>
                    For å se resultater må minst tre deltakere ha svart på
                    spørsmålene.
                </List.Item>
            </List>
        </BekreftValgModal>
    );
}
