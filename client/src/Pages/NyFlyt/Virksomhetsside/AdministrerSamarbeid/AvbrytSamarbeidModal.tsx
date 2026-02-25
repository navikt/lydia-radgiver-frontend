import React from "react";
import { BodyLong, Modal } from "@navikt/ds-react";

export default function AvbrytSamarbeidModal({
    ref,
}: {
    ref: React.RefObject<HTMLDialogElement | null>;
}) {
    return (
        <Modal ref={ref} header={{ heading: "Avbryt samarbeid" }}>
            <Modal.Body>
                <BodyLong>AvbrytSamarbeidModal</BodyLong>
            </Modal.Body>
        </Modal>
    );
}
