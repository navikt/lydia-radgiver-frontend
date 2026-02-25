import React from "react";
import { BodyLong, Modal } from "@navikt/ds-react";

export default function SlettSamarbeidModal({
    ref,
}: {
    ref: React.RefObject<HTMLDialogElement | null>;
}) {
    return (
        <Modal ref={ref} header={{ heading: "Slett samarbeid" }}>
            <Modal.Body>
                <BodyLong>SlettSamarbeidModal</BodyLong>
            </Modal.Body>
        </Modal>
    );
}
