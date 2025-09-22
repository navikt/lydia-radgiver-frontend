import { ExpansionCard } from "@navikt/ds-react";
import { SpørreundersøkelseResultat } from "./SpørreundersøkelseResultat";
import { CardInnholdProps, useSpørreundersøkelse } from "../../../components/Spørreundersøkelse/SpørreundersøkelseContext";

export const BehovsvurderingRadInnhold = ({
    spørreundersøkelse: behovsvurdering,
}: CardInnholdProps) => {
    const behovsvurderingStatus = behovsvurdering.status;
    const { iaSak } = useSpørreundersøkelse();

    if (iaSak !== undefined) {
        if (behovsvurderingStatus === "AVSLUTTET" && behovsvurdering.harMinstEttResultat) {
            return (
                <ExpansionCard.Content>
                    <SpørreundersøkelseResultat
                        iaSak={iaSak}
                        spørreundersøkelseId={behovsvurdering.id}
                    />
                </ExpansionCard.Content>
            );
        }
    }

    return null;
};