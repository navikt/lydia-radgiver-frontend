import React from "react";
import { BodyLong, Button, LocalAlert, Modal } from "@navikt/ds-react";
import {
    IaSakProsess,
    IASamarbeidStatusType,
    SamarbeidRequest,
} from "../../../domenetyper/iaSakProsess";
import { IASak } from "../../../domenetyper/domenetyper";
import { avsluttSamarbeidNyFlyt } from "../../../api/lydia-api/nyFlyt";

export default function BekreftSisteSamarbeidModal({
    ref,
    valgtSamarbeid,
    iaSak,
    nyStatus,
    alleSamarbeid,
}: {
    ref: React.RefObject<HTMLDialogElement | null>;
    valgtSamarbeid?: IaSakProsess | null;
    iaSak?: IASak;
    nyStatus: IASamarbeidStatusType;
    alleSamarbeid?: IaSakProsess[];
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
                status: nyStatus,
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
            ref.current?.close();
        }
    };

    return (
        <Modal
            ref={ref}
            header={{
                heading: `${getTittel(nyStatus)} avdeling ${valgtSamarbeid?.navn}`,
            }}
        >
            <Modal.Body>
                <LocalAlert status="announcement">
                    <LocalAlert.Header>
                        <LocalAlert.Title>
                            Samarbeidsperioden vil bli avsluttet
                        </LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>
                        Du er i ferd med å avslutte det siste aktive
                        samarbeidet. Når du {getStatusPresens(nyStatus)}{" "}
                        <b>{valgtSamarbeid?.navn}</b> vil samarbeidsperioden
                        avsluttes og virksomheten får status Avsluttet.
                    </LocalAlert.Content>
                    <LocalAlert.Content>
                        <dl>
                            {/* TODO: Pen rendering av lista */}
                            {alleSamarbeid?.map((s) => (
                                <div key={s.id}>
                                    <dt>{s.navn}</dt>
                                    <dd>{s.status}</dd>
                                </div>
                            )) ?? null}
                        </dl>
                    </LocalAlert.Content>
                </LocalAlert>
                <BodyLong>
                    Ønsker du å {getStatusInfinitiv(nyStatus)} samarbeidet og
                    sette virksomheten til avsluttet?
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

function getTittel(nyStatus: IASamarbeidStatusType) {
    switch (nyStatus) {
        case "AVBRUTT":
            return "Avbryt samarbeidet";
        case "FULLFØRT":
            return "Fullfør samarbeidet";
        default:
            return "";
    }
}

function getStatusPresens(nyStatus: IASamarbeidStatusType) {
    switch (nyStatus) {
        case "AVBRUTT":
            return "avbryter";
        case "FULLFØRT":
            return "fullfører";
        default:
            return "";
    }
}

function getStatusInfinitiv(nyStatus: IASamarbeidStatusType) {
    switch (nyStatus) {
        case "AVBRUTT":
            return "avbryte";
        case "FULLFØRT":
            return "fullføre";
        default:
            return "";
    }
}

export function erSisteSamarbeid(
    samarbeid?: IaSakProsess | null,
    alleSamarbeid?: IaSakProsess[],
): boolean {
    const aktiveSamarbeidsstatuser = ["AKTIV"];
    return (
        alleSamarbeid?.find(
            (s) =>
                s.id !== samarbeid?.id &&
                aktiveSamarbeidsstatuser.includes(s.status),
        ) === undefined
    );
}
