import { ExpansionCard } from "@navikt/ds-react";
import { IASakKartlegging } from "../../../../domenetyper/iaSakKartlegging";
import { BehovsvurderingResultat } from "../../Kartlegging/BehovsvurderingResultat";
import { useSpørreundersøkelse } from "../../../../components/Spørreundersøkelse/SpørreundersøkelseContext";

export const EvalueringRadInnhold = ({
    behovsvurdering,
}: {

    behovsvurdering: IASakKartlegging;
}) => {

    const behovsvurderingStatus = behovsvurdering.status;
    const {
        iaSak,
    } = useSpørreundersøkelse();

    if (iaSak !== undefined) {
        if (behovsvurderingStatus === "AVSLUTTET") {
            return (
                <ExpansionCard.Content>
                    <BehovsvurderingResultat
                        iaSak={iaSak}
                        behovsvurderingId={behovsvurdering.kartleggingId}
                    />
                </ExpansionCard.Content>
            );
        }
    }
};