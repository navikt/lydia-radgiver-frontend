import React from "react";
import { BodyLong, Modal } from "@navikt/ds-react";

export default function FullførSamarbeidModal({
    ref,
}: {
    ref: React.RefObject<HTMLDialogElement | null>;
}) {
    return (
        <Modal ref={ref} header={{ heading: "Fullfør samarbeid" }}>
            <Modal.Body>
                <BodyLong>FullførSamarbeidModal</BodyLong>
            </Modal.Body>
        </Modal>
    );
}
