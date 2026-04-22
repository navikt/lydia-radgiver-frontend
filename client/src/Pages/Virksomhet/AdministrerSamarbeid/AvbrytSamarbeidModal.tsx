import React from "react";
import { BodyLong, Button, List, LocalAlert, Modal } from "@navikt/ds-react";
import {
    IaSakProsess,
    SamarbeidRequest,
} from "../../../domenetyper/iaSakProsess";
import {
    IASak,
    spørreundersøkelseStatusEnum,
} from "../../../domenetyper/domenetyper";
import {
    avsluttSamarbeidNyFlyt,
    useHentSisteSakNyFlyt,
    useHentSpesifikkSakNyFlyt,
} from "../../../api/lydia-api/nyFlyt";
import BekreftSisteSamarbeidModal, {
    erSisteSamarbeid,
} from "./BekreftSisteSamarbeidModal";
import {
    useHentSamarbeid,
    useSpørreundersøkelsesliste,
} from "../../../api/lydia-api/spørreundersøkelse";
import { useHentPlan } from "../../../api/lydia-api/plan";
import { SpørreundersøkelseTypeEnum } from "../../../domenetyper/spørreundersøkelseMedInnhold";
import styles from "./administrerSamarbeid.module.scss";

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
    if (
        iaSak === undefined ||
        valgtSamarbeid === undefined ||
        valgtSamarbeid?.id === undefined ||
        alleSamarbeid === undefined
    ) {
        return null;
    }

    const {
        data: spørreundersøkelser,
        loading: lasterSpørreundersøkelser,
        mutate: revaliderSpørreundersøkelser,
    } = useSpørreundersøkelsesliste(
        iaSak.orgnr,
        iaSak.saksnummer,
        valgtSamarbeid.id,
    );

    const harEnPåbegyntEllerOpprettetEvaluering = React.useMemo(
        () =>
            spørreundersøkelser?.some(
                (su) =>
                    su.type === SpørreundersøkelseTypeEnum.enum.EVALUERING &&
                    (su.status === spørreundersøkelseStatusEnum.enum.PÅBEGYNT ||
                        su.status ===
                            spørreundersøkelseStatusEnum.enum.OPPRETTET),
            ) ?? false,
        [spørreundersøkelser],
    );

    const harPåbegynteEllerOpprettedeBehovsvurderinger = React.useMemo(
        () =>
            spørreundersøkelser?.some(
                (su) =>
                    su.type ===
                        SpørreundersøkelseTypeEnum.enum.BEHOVSVURDERING &&
                    (su.status === spørreundersøkelseStatusEnum.enum.PÅBEGYNT ||
                        su.status ===
                            spørreundersøkelseStatusEnum.enum.OPPRETTET),
            ) ?? false,
        [spørreundersøkelser],
    );

    React.useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;

        const callback = () => {
            if (dialog.open) {
                revaliderSpørreundersøkelser();
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(dialog, {
            attributes: true,
            attributeFilter: ["open"],
        });

        return () => observer.disconnect();
    }, [revaliderSpørreundersøkelser]);

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

    const { mutate: hentPlanPåNytt } = useHentPlan(
        iaSak?.orgnr,
        iaSak?.saksnummer,
        valgtSamarbeid?.id,
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
            hentPlanPåNytt();
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
                    {/* Error alert fordi samarbeid har påbegynte behovsvurderinger eller har påbegynte evalueringer */}
                    {(harPåbegynteEllerOpprettedeBehovsvurderinger ||
                        harEnPåbegyntEllerOpprettetEvaluering) && (
                        <LocalAlert
                            status="error"
                            className={styles.errorAlert}
                        >
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Samarbeidet kan ikke avbrytes
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>
                                <List>
                                    {harPåbegynteEllerOpprettedeBehovsvurderinger && (
                                        <List.Item>
                                            Det finnes en påbegynt
                                            behovsvurdering
                                        </List.Item>
                                    )}
                                    {harEnPåbegyntEllerOpprettetEvaluering && (
                                        <List.Item>
                                            Det finnes en påbegynt evaluering
                                        </List.Item>
                                    )}
                                </List>
                            </LocalAlert.Content>
                        </LocalAlert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onAvbryt}
                        disabled={
                            lasterSpørreundersøkelser ||
                            senderRequest ||
                            harEnPåbegyntEllerOpprettetEvaluering ||
                            harPåbegynteEllerOpprettedeBehovsvurderinger
                        }
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
