import { ExpansionCard } from "@navikt/ds-react";
import { Spørreundersøkelse } from "../../../domenetyper/spørreundersøkelse";
import { BehovsvurderingResultat } from "./BehovsvurderingResultat";
import { useSpørreundersøkelse } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";

export const BehovsvurderingRadInnhold = ({
    behovsvurdering,
}: {
    behovsvurdering: Spørreundersøkelse;
}) => {
    const behovsvurderingStatus = behovsvurdering.status;
    const { iaSak } = useSpørreundersøkelse();

    if (iaSak !== undefined) {
        if (behovsvurderingStatus === "AVSLUTTET") {
            return (
                <ExpansionCard.Content>
                    <BehovsvurderingResultat
                        iaSak={iaSak}
                        behovsvurderingId={behovsvurdering.id}
                    />
                </ExpansionCard.Content>
            );
        }
    }
};
