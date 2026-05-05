import { BodyLong, Button, LocalAlert, Modal } from "@navikt/ds-react";
import React from "react";
import {
    slettSamarbeidNyFlyt,
    useHentSisteSakNyFlyt,
    useHentSpesifikkSakNyFlyt,
} from "@/api/lydia-api/nyFlyt";
import { useHentSamarbeid } from "@/api/lydia-api/spørreundersøkelse";
import { useKanUtføreHandlingPåSamarbeid } from "@/api/lydia-api/virksomhet";
import { IASak } from "@/domenetyper/domenetyper";
import { IaSakProsess } from "@/domenetyper/iaSakProsess";
import styles from "./administrerSamarbeid.module.scss";
import BekreftSisteSamarbeidModal, {
    erSisteSamarbeid,
} from "./BekreftSisteSamarbeidModal";
import SlettSamarbeidModalBegrunnelser from "./SlettSamarbeidModalBegrunnelser";

export default function SlettSamarbeidModal({
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

    const { data: kanSletteResultat } = useKanUtføreHandlingPåSamarbeid(
        iaSak?.orgnr,
        iaSak?.saksnummer,
        valgtSamarbeid?.id,
        "slettes",
    );

    const kanSlettes = kanSletteResultat?.kanGjennomføres;

    const [error, setError] = React.useState<string | null>(null);

    const onSlett = async () => {
        setError(null);
        if (
            alleSamarbeid &&
            alleSamarbeid.length > 1 &&
            erSisteSamarbeid(valgtSamarbeid, alleSamarbeid)
        ) {
            ref.current?.close();
            bekreftSisteSamarbeidRef.current?.showModal();
            return;
        } else if (iaSak && valgtSamarbeid) {
            try {
                await slettSamarbeidNyFlyt(iaSak?.orgnr, valgtSamarbeid?.id);
                ref.current?.close();
            } catch (e) {
                setError(e instanceof Error ? e.message : String(e));
            } finally {
                hentSpesifikkSakPåNytt();
                hentSisteSakPåNytt();
                hentSamarbeidPåNytt();
            }
        } else {
            setError("Kunne ikke finne sak for samarbeid");
        }
    };
    return (
        <>
            <Modal
                ref={ref}
                header={{ heading: `Slett ${valgtSamarbeid?.navn}` }}
            >
                <Modal.Body>
                    {!kanSlettes ? (
                        <SlettSamarbeidModalBegrunnelser
                            kanGjennomføreResultat={kanSletteResultat}
                        ></SlettSamarbeidModalBegrunnelser>
                    ) : (
                        <BodyLong>
                            Ønsker du å slette samarbeidet{" "}
                            {valgtSamarbeid?.navn}?
                            {alleSamarbeid &&
                                alleSamarbeid?.length === 1 &&
                                " Virksomheten vil gå tilbake til å være i status Vurderes."}
                        </BodyLong>
                    )}

                    {error && (
                        <LocalAlert
                            status="error"
                            className={styles.errorAlert}
                        >
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Noe gikk galt
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>{error}</LocalAlert.Content>
                        </LocalAlert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant={"primary"}
                        onClick={onSlett}
                        disabled={!kanSlettes}
                    >
                        Slett
                    </Button>
                    <Button
                        variant={"secondary"}
                        onClick={() => ref.current?.close()}
                    >
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
            <BekreftSisteSamarbeidModal
                ref={bekreftSisteSamarbeidRef}
                iaSak={iaSak}
                valgtSamarbeid={valgtSamarbeid}
                nyStatus="SLETTET"
                alleSamarbeid={alleSamarbeid}
            />
        </>
    );
}
