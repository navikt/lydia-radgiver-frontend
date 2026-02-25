import React from "react";
import { BodyLong, Modal } from "@navikt/ds-react";

export default function EndreSamarbeidsnavnModal({
    ref,
}: {
    ref: React.RefObject<HTMLDialogElement | null>;
}) {
    return (
        <Modal ref={ref} header={{ heading: "Endre samarbeidsnavn" }}>
            <Modal.Body>
                <BodyLong>EndreSamarbeidsnavnModal</BodyLong>
            </Modal.Body>
        </Modal>
    );
}
