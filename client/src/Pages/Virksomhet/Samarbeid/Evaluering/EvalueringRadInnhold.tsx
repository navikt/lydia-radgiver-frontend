import { ExpansionCard } from "@navikt/ds-react";
import { SpørreundersøkelseResultat } from "../../Kartlegging/SpørreundersøkelseResultat";
import { CardInnholdProps, useSpørreundersøkelse } from "../../../../components/Spørreundersøkelse/SpørreundersøkelseContext";

export const EvalueringRadInnhold = ({
    spørreundersøkelse,
}: CardInnholdProps) => {
    const spørreundersøkelseStatus = spørreundersøkelse.status;
    const { iaSak } = useSpørreundersøkelse();

    if (iaSak !== undefined) {
        if (spørreundersøkelseStatus === "AVSLUTTET" && spørreundersøkelse.harMinstEttResultat) {
            return (
                <ExpansionCard.Content>
                    <SpørreundersøkelseResultat
                        iaSak={iaSak}
                        spørreundersøkelseId={spørreundersøkelse.id}
                    />
                </ExpansionCard.Content>
            );
        }
    }

    return null;
};
