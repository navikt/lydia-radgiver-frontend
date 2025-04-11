import React from "react";
import { BodyShort, Button, Modal } from "@navikt/ds-react";
import { nyHendelsePåSak, useHentMineSaker } from "../../api/lydia-api/sak";
import { IASak } from "../../domenetyper/domenetyper";
import { useHentSakForVirksomhet } from "../../api/lydia-api/virksomhet";

interface TaEierskapModalProps {
    erModalÅpen: boolean;
    lukkModal: () => void;
    iaSak: IASak;
}

export const TaEierskapModal = ({
    erModalÅpen,
    lukkModal,
    iaSak,
}: TaEierskapModalProps) => {
    const modaltittel = `Er du sikker på at du vil ta eierskap?`;
    const { mutate: muterIaSak } = useHentSakForVirksomhet(iaSak.orgnr, iaSak.saksnummer);
    const { mutate: muterMineSaker } = useHentMineSaker();
    return (
        <Modal
            open={erModalÅpen}
            onClose={() => lukkModal()}
            header={{ heading: modaltittel, size: "small" }}
            width="42rem"
        >
            <Modal.Body>
                <BodyShort>
                    Nåværende eier vil fjernes og du blir automatisk eier av
                    saken.
                </BodyShort>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={async () => {
                        await nyHendelsePåSak(
                            iaSak,
                            {
                                saksHendelsestype: "TA_EIERSKAP_I_SAK",
                                gyldigeÅrsaker: [],
                            },
                            null,
                            null,
                        );
                        muterIaSak();
                        muterMineSaker();
                        lukkModal();
                    }}
                >
                    Ta eierskap
                </Button>
                <Button variant="secondary" onClick={() => lukkModal()}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
