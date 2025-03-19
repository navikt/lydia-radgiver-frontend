import React from "react";
import OpprettBehovsvurderingAlert from "../../Pages/Virksomhet/Kartlegging/OpprettetBehovsvurderingAlert";
import { useVirksomhetContext } from "../../Pages/Virksomhet/VirksomhetContext";
import { sorterPåDato, formaterDatoForSpørreundersøkelse } from "./dato";
import { useSpørreundersøkelse } from "./SpørreundersøkelseContext";
import SpørreundersøkelseRad from "./SpørreundersøkelseRad";

export default function Spørreundersøkelseliste() {
    const { spørreundersøkelseliste, sisteOpprettedeSpørreundersøkelseId, setSisteOpprettedeSpørreundersøkelseId } =
        useSpørreundersøkelse();

    const { spørreundersøkelseId } = useVirksomhetContext();

    return (
        spørreundersøkelseliste.length > 0 &&
        sorterPåDato(spørreundersøkelseliste).map(
            (behovsvurdering, index, originalArray) => (
                <React.Fragment key={behovsvurdering.id}>
                    <SpørreundersøkelseRad
                        spørreundersøkelse={behovsvurdering}
                        avstandFraSiste={spørreundersøkelseliste.length - index}
                        dato={formaterDatoForSpørreundersøkelse(
                            behovsvurdering,
                            index,
                            originalArray,
                        )}
                        defaultOpen={
                            behovsvurdering.id ===
                            sisteOpprettedeSpørreundersøkelseId ||
                            behovsvurdering.id === spørreundersøkelseId
                        }
                    />
                    {
                        behovsvurdering.id ===
                            sisteOpprettedeSpørreundersøkelseId ? (
                            <OpprettBehovsvurderingAlert onClose={() => setSisteOpprettedeSpørreundersøkelseId("")} />
                        ) : null
                    }
                </React.Fragment>
            ),
        )
    );
}
