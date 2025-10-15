import { BodyLong, Button, Heading, Modal } from "@navikt/ds-react";
import React from "react";
import {publiserSamarbeidsplan} from "../../../api/lydia-api/dokumentpublisering";
import {Plan} from "../../../domenetyper/plan";

interface PubliseringModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    plan: Plan;
    hentSamarbeidsplanPåNytt: () => void;
}

export const PubliseringModal = ({
     open,
     setOpen,
     plan,
     hentSamarbeidsplanPåNytt,
}: PubliseringModalProps) => {
    const publiser = () => {
        publiserSamarbeidsplan(plan).then(() => {
            hentSamarbeidsplanPåNytt();
            setOpen(false);
        });
    };
    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-label={"Publiser samarbeidsplan"}
        >
            <Modal.Header closeButton={true}>
                <Heading size="medium">Publiser samarbeidsplan</Heading>
            </Modal.Header>
            <Modal.Body>
                <BodyLong>
                    Når du publiserer til Min side - Arbeidsgiver, blir samarbeidsplanen tilgjengelig for alle i virksomheten med Altinn-tilgangen “Øvelser og verktøy”.
                </BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" onClick={() => publiser()}>
                    Publiser samarbeidsplan
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setOpen(false)}
                >
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
