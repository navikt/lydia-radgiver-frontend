import React from "react";
import { BodyLong, Button, LocalAlert, Modal } from "@navikt/ds-react";
import {
    IaSakProsess,
    IASamarbeidStatusType,
    SamarbeidRequest,
} from "../../../domenetyper/iaSakProsess";
import { IASak } from "../../../domenetyper/domenetyper";
import {
    avsluttSamarbeidNyFlyt,
    slettSamarbeidNyFlyt,
    useHentSisteSakNyFlyt,
    useHentSpesifikkSakNyFlyt,
    useHentTilstandForVirksomhetNyFlyt,
} from "../../../api/lydia-api/nyFlyt";
import { useHentSamarbeid } from "../../../api/lydia-api/spørreundersøkelse";
import { SamarbeidStatusBadge } from "../../../components/Badge/SamarbeidStatusBadge";
import styles from "./bekreftSisteSamarbeidModal.module.scss";

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
    const { mutate: hentSisteSakPåNytt } = useHentSisteSakNyFlyt(iaSak?.orgnr);
    const { mutate: hentSpesifikkSakPåNytt } = useHentSpesifikkSakNyFlyt(
        iaSak?.orgnr,
        iaSak?.saksnummer,
    );
    const { mutate: hentSamarbeidPåNytt } = useHentSamarbeid(
        iaSak?.orgnr,
        iaSak?.saksnummer,
    );
    const { mutate: hentTilstandPåNytt } = useHentTilstandForVirksomhetNyFlyt(
        iaSak?.orgnr,
    );

    const onConfirmAction = async () => {
        setSenderRequest(true);

        try {
            if (!valgtSamarbeid?.id || !iaSak?.orgnr) {
                return;
            }

            if (nyStatus === "SLETTET") {
                await slettSamarbeidNyFlyt(iaSak.orgnr, valgtSamarbeid.id);
            } else {
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
                    valgtSamarbeid?.id,
                    samarbeid,
                );
            }
        } catch {
            ref.current?.close();
        } finally {
            setSenderRequest(false);
            hentSpesifikkSakPåNytt();
            hentSisteSakPåNytt();
            hentSamarbeidPåNytt();
            hentTilstandPåNytt();
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
                        <dl className={styles.samarbeidsliste}>
                            {alleSamarbeid?.map((s) => (
                                <div
                                    key={s.id}
                                    className={styles.samarbeidslisterad}
                                >
                                    <dt>{s.navn}</dt>
                                    <SamarbeidStatusBadge
                                        status={s.status}
                                        as="dd"
                                    />
                                </div>
                            )) ?? null}
                        </dl>
                    </LocalAlert.Content>
                </LocalAlert>
                <BodyLong style={{ marginTop: "1rem" }}>
                    Ønsker du å {getStatusInfinitiv(nyStatus)} samarbeidet og
                    sette virksomheten til avsluttet?
                </BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => ref.current?.close()} variant="tertiary">
                    Lukk
                </Button>
                <Button
                    onClick={onConfirmAction}
                    disabled={senderRequest}
                    loading={senderRequest}
                >
                    {getTittel(nyStatus)}
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
        case "SLETTET":
            return "Slett samarbeidet";
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
        case "SLETTET":
            return "sletter";
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
        case "SLETTET":
            return "slette";
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
