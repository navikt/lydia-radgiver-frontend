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
                <List.Item>Det må være minst tre deltakere for å gjennomføre og for å vise resultatene.</List.Item>
                <List.Item>Når du starter behovsvurderingen må den fullføres innen 24 timer.</List.Item>
            </List>
        </BekreftValgModal>
    );
}
