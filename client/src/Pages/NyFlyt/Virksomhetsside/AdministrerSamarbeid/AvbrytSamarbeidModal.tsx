import React from "react";
import { BodyLong, Button, Modal } from "@navikt/ds-react";
import {
    IaSakProsess,
    SamarbeidRequest,
} from "../../../../domenetyper/iaSakProsess";
import { IASak } from "../../../../domenetyper/domenetyper";
import { avsluttSamarbeidNyFlyt } from "../../../../api/lydia-api/nyFlyt";

export default function AvbrytSamarbeidModal({
    ref,
    valgtSamarbeid,
    iaSak,
}: {
    ref: React.RefObject<HTMLDialogElement | null>;
    valgtSamarbeid?: IaSakProsess | null;
    iaSak?: IASak;
}) {
    const [senderRequest, setSenderRequest] = React.useState(false);

    const onAvbryt = async () => {
        setSenderRequest(true);

        try {
            if (!valgtSamarbeid?.id || !iaSak?.orgnr) {
                return;
            }

            const samarbeid: SamarbeidRequest = {
                id: valgtSamarbeid?.id,
                navn: valgtSamarbeid?.navn,
                status: "AVBRUTT",
                startDato: null,
                sluttDato: null,
                endretTidspunkt: null,
            };

            await avsluttSamarbeidNyFlyt(
                iaSak?.orgnr || "",
                String(valgtSamarbeid?.id || ""),
                samarbeid,
            );
        } catch {
            ref.current?.close();
        } finally {
            setSenderRequest(false);
        }
    };

    return (
        <Modal
            ref={ref}
            header={{
                heading: `Avbryt samarbeidet med ${valgtSamarbeid?.navn}`,
            }}
        >
            <Modal.Body>
                <BodyLong>
                    Når du avbryter vil det ikke være mulig å gjøre nye
                    endringer på samarbeidet.
                </BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => ref.current?.close()} variant="tertiary">
                    Lukk
                </Button>
                <Button
                    onClick={onAvbryt}
                    disabled={senderRequest}
                    loading={senderRequest}
                >
                    Avbryt samarbeidet
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
