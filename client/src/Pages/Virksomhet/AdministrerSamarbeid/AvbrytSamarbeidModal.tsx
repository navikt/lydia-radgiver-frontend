import React from "react";
import { BodyLong, Button, Modal } from "@navikt/ds-react";
import {
    IaSakProsess,
    SamarbeidRequest,
} from "../../../domenetyper/iaSakProsess";
import { IASak } from "../../../domenetyper/domenetyper";
import {
    avsluttSamarbeidNyFlyt,
    useHentSisteSakNyFlyt,
    useHentSpesifikkSakNyFlyt,
} from "../../../api/lydia-api/nyFlyt";
import BekreftSisteSamarbeidModal, {
    erSisteSamarbeid,
} from "./BekreftSisteSamarbeidModal";
import { useHentSamarbeid } from "../../../api/lydia-api/spørreundersøkelse";

export default function AvbrytSamarbeidModal({
    ref,
    valgtSamarbeid,
    iaSak,
    alleSamarbeid,
}: {
    ref: React.RefObject<HTMLDialogElement | null>;
    valgtSamarbeid?: IaSakProsess | null;
    iaSak?: IASak;
    alleSamarbeid?: IaSakProsess[];
}) {
    const bekreftSisteSamarbeidRef = React.useRef<HTMLDialogElement | null>(
        null,
    );
    const { mutate: hentSisteSakPåNytt } = useHentSisteSakNyFlyt(iaSak?.orgnr);
    const { mutate: hentSpesifikkSakPåNytt } = useHentSpesifikkSakNyFlyt(
        iaSak?.orgnr,
        iaSak?.saksnummer,
    );
    const { mutate: hentSamarbeidPåNytt } = useHentSamarbeid(
        iaSak?.orgnr,
        iaSak?.saksnummer,
    );
    const [senderRequest, setSenderRequest] = React.useState(false);

    const onAvbryt = async () => {
        setSenderRequest(true);

        if (erSisteSamarbeid(valgtSamarbeid, alleSamarbeid)) {
            bekreftSisteSamarbeidRef.current?.showModal();
            setSenderRequest(false);
            return;
        }

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
                valgtSamarbeid?.id,
                samarbeid,
            );
        } catch {
            ref.current?.close();
        } finally {
            setSenderRequest(false);
            hentSpesifikkSakPåNytt();
            hentSisteSakPåNytt();
            hentSamarbeidPåNytt();
        }
    };

    return (
        <>
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
                    <Button
                        onClick={onAvbryt}
                        disabled={senderRequest}
                        loading={senderRequest}
                    >
                        Avbryt samarbeidet
                    </Button>
                    <Button
                        onClick={() => ref.current?.close()}
                        variant="secondary"
                    >
                        Lukk
                    </Button>
                </Modal.Footer>
            </Modal>
            <BekreftSisteSamarbeidModal
                ref={bekreftSisteSamarbeidRef}
                iaSak={iaSak}
                valgtSamarbeid={valgtSamarbeid}
                nyStatus="AVBRUTT"
                alleSamarbeid={alleSamarbeid}
            />
        </>
    );
}
