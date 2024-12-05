import React from "react";
import {
    BodyShort,
    Modal,
} from "@navikt/ds-react";
import Forhåndsvisning from "./Forhåndsvisning";

interface SpørreundersøkelseMedInnholdVisningProps {
    erModalÅpen: boolean;
    lukkModal: () => void;
    spørreundersøkelseid: string;
}

export const SpørreundersøkelseMedInnholdVisning = ({
    erModalÅpen,
    lukkModal,
    spørreundersøkelseid
}: SpørreundersøkelseMedInnholdVisningProps) => {
    const [modaltittel, setModaltittel] = React.useState<string>("Forhåndsvisning laster...");
    return (
        <Modal
            open={erModalÅpen}
            onClose={lukkModal}
            header={{ heading: modaltittel, size: "small" }}
            width="70rem"
        >
            <Modal.Body>
                <BodyShort>Spørsmålene er basert på innholdet i samarbeidsplanen ved opprettelse</BodyShort>
                <Forhåndsvisning spørreundersøkelseid={spørreundersøkelseid} setModaltittel={setModaltittel} />
            </Modal.Body>
        </Modal>
    );
};

