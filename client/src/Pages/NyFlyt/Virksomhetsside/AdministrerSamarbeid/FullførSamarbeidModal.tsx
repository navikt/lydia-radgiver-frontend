import React from "react";
import { BodyLong, Button, LocalAlert, Modal } from "@navikt/ds-react";
import {
    IaSakProsess,
    SamarbeidRequest,
} from "../../../../domenetyper/iaSakProsess";
import { SpørreundersøkelseTypeEnum } from "../../../../domenetyper/spørreundersøkelseMedInnhold";
import {
    IASak,
    spørreundersøkelseStatusEnum,
} from "../../../../domenetyper/domenetyper";
import { useHentSpørreundersøkelser } from "../../../../api/lydia-api/spørreundersøkelse";
import { avsluttSamarbeidNyFlyt } from "../../../../api/lydia-api/nyFlyt";
import styles from "./administrerSamarbeid.module.scss";
import { useHentPlan } from "../../../../api/lydia-api/plan";

export default function FullførSamarbeidModal({
    ref,
    valgtSamarbeid,
    iaSak,
}: {
    ref: React.RefObject<HTMLDialogElement | null>;
    valgtSamarbeid?: IaSakProsess | null;
    iaSak?: IASak;
}) {
    const [senderRequest, setSenderRequest] = React.useState(false);
    const plan = useHentPlan(
        iaSak?.orgnr,
        iaSak?.saksnummer,
        valgtSamarbeid?.id,
    );
    const { data: evalueringer, loading: lasterEvalueringer } =
        useHentSpørreundersøkelser(
            iaSak?.orgnr,
            iaSak?.saksnummer,
            valgtSamarbeid?.id,
            SpørreundersøkelseTypeEnum.enum.EVALUERING,
        );

    const evalueringErFullført = React.useMemo(() => {
        if (!evalueringer || evalueringer.length === 0) {
            return false;
        }

        const førsteFullførteEvaluering = evalueringer.find(
            (su) =>
                su.type === SpørreundersøkelseTypeEnum.enum.EVALUERING &&
                su.status === spørreundersøkelseStatusEnum.enum.AVSLUTTET &&
                su.harMinstEttResultat,
        );

        return !!førsteFullførteEvaluering;
    }, [evalueringer]);

    const onFullfør = async () => {
        setSenderRequest(true);
        try {
            if (!valgtSamarbeid?.id || !iaSak?.orgnr) {
                return;
            }

            const samarbeid: SamarbeidRequest = {
                id: valgtSamarbeid?.id,
                navn: valgtSamarbeid?.navn,
                status: "FULLFØRT",
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
                heading: `Fullfør samarbeidet med ${valgtSamarbeid?.navn}`,
            }}
        >
            <Modal.Body>
                <BodyLong>
                    Når du fullfører vil det ikke være mulig å gjøre nye
                    endringer på samarbeidet.
                </BodyLong>
                {plan.data && !evalueringErFullført && (
                    <LocalAlert
                        status="warning"
                        className={styles.warningAlert}
                    >
                        <LocalAlert.Header>
                            <LocalAlert.Title>
                                Evaluering er ikke gjennomført, vil du fortsatt
                                fullføre?
                            </LocalAlert.Title>
                        </LocalAlert.Header>
                    </LocalAlert>
                )}
                {!plan.data && (
                    <LocalAlert status="error" className={styles.errorAlert}>
                        <LocalAlert.Header>
                            <LocalAlert.Title>
                                Samarbeidet må ha en plan for å fullføre
                                samarbeid.
                            </LocalAlert.Title>
                        </LocalAlert.Header>
                    </LocalAlert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => ref.current?.close()} variant="tertiary">
                    Avbryt
                </Button>
                <Button
                    onClick={onFullfør}
                    disabled={lasterEvalueringer || senderRequest || !plan.data}
                    loading={senderRequest}
                >
                    Fullfør samarbeidet
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
