import { BodyShort, Button, Modal } from "@navikt/ds-react";
import React from "react";
import { IASak } from "@/domenetyper/domenetyper";
import {
    bliEierNyFlyt,
    useHentSpesifikkSakNyFlyt,
} from "@features/sak/api/nyFlyt";
import { useHentMineSaker } from "@features/sak/api/sak";
import { useOversiktMutate } from "../Virksomhet/Debugside/Oversikt";

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
    const { mutate: muterIaSak } = useHentSpesifikkSakNyFlyt(
        iaSak.orgnr,
        iaSak.saksnummer,
    );
    const { mutate: muterMineSaker } = useHentMineSaker();
    const muterOversikt = useOversiktMutate(iaSak.orgnr);
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
                        await bliEierNyFlyt(iaSak.orgnr);
                        muterIaSak();
                        muterMineSaker();
                        muterOversikt();
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
