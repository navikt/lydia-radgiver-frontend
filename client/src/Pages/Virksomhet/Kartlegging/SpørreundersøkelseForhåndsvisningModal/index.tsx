import { BodyShort, HStack, Modal } from "@navikt/ds-react";
import React from "react";
import { Spørreundersøkelse } from "@/domenetyper/spørreundersøkelse";
import ForhåndsvisningEksport from "../ForhåndsvisningEksport";
import Forhåndsvisning from "./Forhåndsvisning";

interface SpørreundersøkelseMedInnholdVisningProps {
    erModalÅpen: boolean;
    lukkModal: () => void;
    spørreundersøkelseid: string;
    spørreundersøkelse: Spørreundersøkelse;
}

export const SpørreundersøkelseMedInnholdVisning = ({
    erModalÅpen,
    lukkModal,
    spørreundersøkelseid,
    spørreundersøkelse,
}: SpørreundersøkelseMedInnholdVisningProps) => {
    const [modaltittel, setModaltittel] = React.useState<string>(
        "Forhåndsvisning laster...",
    );
    const [erIEksportMode, setErIEksportMode] = React.useState(false);
    return (
        <Modal
            open={erModalÅpen}
            onClose={lukkModal}
            header={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                heading: (
                    <HStack
                        justify={"space-between"}
                        style={{ paddingRight: "1rem" }}
                    >
                        {modaltittel}
                        <ForhåndsvisningEksport
                            spørreundersøkelse={spørreundersøkelse}
                            erIEksportMode={erIEksportMode}
                            setErIEksportMode={setErIEksportMode}
                        />
                    </HStack>
                ),
                size: "small",
            }}
            width="70rem"
        >
            <Modal.Body>
                <BodyShort>
                    Spørsmålene er basert på innholdet i samarbeidsplanen ved
                    opprettelse
                </BodyShort>
                <Forhåndsvisning
                    spørreundersøkelseid={spørreundersøkelseid}
                    setModaltittel={setModaltittel}
                />
            </Modal.Body>
        </Modal>
    );
};
