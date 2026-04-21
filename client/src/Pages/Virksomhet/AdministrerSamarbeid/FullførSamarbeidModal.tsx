import React from "react";
import { BodyLong, Button, List, LocalAlert, Modal } from "@navikt/ds-react";
import {
    IaSakProsess,
    SamarbeidRequest,
} from "../../../domenetyper/iaSakProsess";
import { SpørreundersøkelseTypeEnum } from "../../../domenetyper/spørreundersøkelseMedInnhold";
import {
    IASak,
    spørreundersøkelseStatusEnum,
} from "../../../domenetyper/domenetyper";
import {
    useHentSamarbeid,
    useSpørreundersøkelsesliste,
} from "../../../api/lydia-api/spørreundersøkelse";
import {
    avsluttSamarbeidNyFlyt,
    useHentSisteSakNyFlyt,
    useHentSpesifikkSakNyFlyt,
} from "../../../api/lydia-api/nyFlyt";
import styles from "./administrerSamarbeid.module.scss";
import { useHentPlan } from "../../../api/lydia-api/plan";
import BekreftSisteSamarbeidModal, {
    erSisteSamarbeid,
} from "./BekreftSisteSamarbeidModal";

export default function FullførSamarbeidModal({
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
    const { data: plan, mutate: hentPlanPåNytt } = useHentPlan(
        iaSak?.orgnr,
        iaSak?.saksnummer,
        valgtSamarbeid?.id,
    );

    const evalueringErFullført = React.useMemo(
        () =>
            spørreundersøkelser?.some(
                (su) =>
                    su.type === SpørreundersøkelseTypeEnum.enum.EVALUERING &&
                    su.status === spørreundersøkelseStatusEnum.enum.AVSLUTTET &&
                    su.harMinstEttResultat,
            ) ?? false,
        [spørreundersøkelser],
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

    const onFullfør = async () => {
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
                status: "FULLFØRT",
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

    const harEnSamarbeidsplan = plan !== undefined;
    return (
        <>
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
                    {/* Warn alert dersom alt er i orden men evaluering er ikke gjennomført */}
                    {harEnSamarbeidsplan &&
                        !evalueringErFullført &&
                        !harEnPåbegyntEllerOpprettetEvaluering &&
                        !harPåbegynteEllerOpprettedeBehovsvurderinger && (
                            <LocalAlert
                                status="warning"
                                className={styles.warningAlert}
                            >
                                <LocalAlert.Header>
                                    <LocalAlert.Title>
                                        Evaluering er ikke gjennomført, vil du
                                        fortsatt fullføre?
                                    </LocalAlert.Title>
                                </LocalAlert.Header>
                            </LocalAlert>
                        )}
                    {/* Error alert fordi: det mangler en plan, har påbegynte behovsvurderinger eller har påbegynte evalueringer */}
                    {(!harEnSamarbeidsplan ||
                        harPåbegynteEllerOpprettedeBehovsvurderinger ||
                        harEnPåbegyntEllerOpprettetEvaluering) && (
                        <LocalAlert
                            status="error"
                            className={styles.errorAlert}
                        >
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Samarbeidet kan ikke fullføres
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>
                                <List>
                                    {!harEnSamarbeidsplan && (
                                        <List.Item>
                                            Mangler samarbeidsplan.
                                        </List.Item>
                                    )}
                                    {harPåbegynteEllerOpprettedeBehovsvurderinger && (
                                        <List.Item>
                                            Det finnes en påbegynt
                                            behovsvurdering.
                                        </List.Item>
                                    )}
                                    {harEnPåbegyntEllerOpprettetEvaluering && (
                                        <List.Item>
                                            Det finnes en påbegynt evaluering.
                                        </List.Item>
                                    )}
                                </List>
                            </LocalAlert.Content>
                        </LocalAlert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onFullfør}
                        disabled={
                            lasterSpørreundersøkelser ||
                            senderRequest ||
                            !harEnSamarbeidsplan ||
                            harEnPåbegyntEllerOpprettetEvaluering ||
                            harPåbegynteEllerOpprettedeBehovsvurderinger
                        }
                        loading={senderRequest}
                    >
                        Fullfør samarbeidet
                    </Button>
                    <Button
                        onClick={() => ref.current?.close()}
                        variant="secondary"
                    >
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
            <BekreftSisteSamarbeidModal
                ref={bekreftSisteSamarbeidRef}
                iaSak={iaSak}
                valgtSamarbeid={valgtSamarbeid}
                nyStatus="FULLFØRT"
                alleSamarbeid={alleSamarbeid}
            />
        </>
    );
}
