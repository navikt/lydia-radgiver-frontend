import { ArrowUndoIcon } from "@navikt/aksel-icons";
import {
    Button,
    LocalAlert,
    Modal,
    RadioGroup,
    Tooltip,
    useDatepicker,
    VStack,
} from "@navikt/ds-react";
import React, { useState } from "react";
import {
    NyFlytBegrunnelse,
    NyFlytÅrsakType,
    nyFlytÅrsakTypeEnum,
} from "@/domenetyper/domenetyper";
import { useOversiktMutate } from "@/Pages/Virksomhet/Debugside/Oversikt";
import { useErPåInaktivSak } from "@/Pages/Virksomhet/VirksomhetContext";
import { isoDato } from "@/util/dato";
import { avsluttVurderingNyFlyt } from "@features/sak/api/nyFlyt";
import { Virksomhet } from "@features/virksomhet/types/virksomhet";
import { AngreVurderingModal } from "./AngreVurderingModal";
import {
    InternVurderingInhold,
    TakketNeiInnhold,
    VurderesSenereInnhold,
} from "./begrunnelseInnhold";
import { ExpandingRadio } from "./ExpandingRadio";

export function AvsluttVurderingModal({
    virksomhet,
    eierEllerFølgerSak,
    erSuperbruker,
}: {
    virksomhet: Virksomhet;
    eierEllerFølgerSak: boolean;
    erSuperbruker: boolean;
}) {
    const erPåInaktivSak = useErPåInaktivSak();
    const [modalErÅpen, setModalErÅpen] = useState(false);

    if (erPåInaktivSak) {
        return (
            <Button disabled size="small" variant="secondary">
                Avslutt vurdering
            </Button>
        );
    }

    if (!eierEllerFølgerSak && !erSuperbruker) {
        return (
            <Tooltip content="Du må vere eier eller følger">
                <div>
                    <Button disabled size="small" variant="secondary">
                        Avslutt vurdering
                    </Button>
                </div>
            </Tooltip>
        );
    }

    return (
        <>
            <Button
                onClick={() => setModalErÅpen(true)}
                size="small"
                variant="secondary"
            >
                Avslutt vurdering
            </Button>
            {modalErÅpen && (
                <AvsluttVurderingModalInnhold
                    erÅpen={modalErÅpen}
                    onClose={() => setModalErÅpen(false)}
                    virksomhet={virksomhet}
                    eierEllerFølgerSak={eierEllerFølgerSak}
                />
            )}
        </>
    );
}

function AvsluttVurderingModalInnhold({
    erÅpen,
    onClose,
    virksomhet,
    eierEllerFølgerSak,
}: {
    erÅpen: boolean;
    onClose: () => void;
    virksomhet: Virksomhet;
    eierEllerFølgerSak: boolean;
}) {
    const mutate = useOversiktMutate(virksomhet.orgnr);
    const [angreVurderingModalÅpen, setAngreVurderingModalÅpen] =
        useState(false);
    const [error, setError] = useState<string | null>();
    const [årsak, setÅrsak] = useState<NyFlytÅrsakType>();
    const [begrunnelse, setBegrunnelse] = useState<NyFlytBegrunnelse[]>([]);
    const [forsøktLagret, setForsøktLagret] = useState(false);
    const defaultDate = new Date();
    const iMorgen = new Date();
    iMorgen.setDate(iMorgen.getDate() + 1);
    defaultDate.setDate(defaultDate.getDate() + 90);
    const {
        datepickerProps,
        inputProps,
        selectedDay,
        reset: resetDatepicker,
    } = useDatepicker({
        fromDate: iMorgen,
        defaultSelected: defaultDate,
    });

    const kanLagre = React.useMemo(
        () =>
            eierEllerFølgerSak &&
            årsak &&
            begrunnelse.length > 0 &&
            selectedDay &&
            selectedDay > new Date(),
        [eierEllerFølgerSak, årsak, begrunnelse, selectedDay],
    );

    const handleSubmit = async () => {
        setError(null);
        setForsøktLagret(true);
        if (kanLagre) {
            try {
                if (!årsak || !selectedDay) {
                    return;
                }

                await avsluttVurderingNyFlyt(virksomhet.orgnr, {
                    type: årsak,
                    begrunnelser: begrunnelse,
                    dato: selectedDay ? isoDato(selectedDay) : undefined,
                });

                mutate();
                onClose();
            } catch (e) {
                setError(e instanceof Error ? e.message : String(e));
            }
        }
    };

    return (
        <>
            <Modal
                open={erÅpen}
                header={{
                    heading: "Avslutt vurdering av virksomheten",
                }}
                width="medium"
                onClose={onClose}
            >
                <Modal.Body>
                    <RadioGroup
                        onChange={(value) => {
                            setBegrunnelse([]);
                            setÅrsak(value as NyFlytÅrsakType);
                            resetDatepicker();
                        }}
                        value={årsak}
                        error={
                            forsøktLagret && !årsak && eierEllerFølgerSak
                                ? "Du må velge en begrunnelse for å avslutte vurderingen"
                                : undefined
                        }
                        hideLegend
                        legend="Årsak for å avslutte vurdering"
                    >
                        <VStack gap="space-16">
                            <ExpandingRadio
                                selected={årsak}
                                value={
                                    nyFlytÅrsakTypeEnum.enum
                                        .VIRKSOMHETEN_VURDERES_PÅ_ET_SENERE_TIDSPUNKT
                                }
                                label="Vurder virksomheten senere"
                            >
                                <VurderesSenereInnhold
                                    forsøktLagret={forsøktLagret}
                                    begrunnelse={begrunnelse}
                                    setBegrunnelse={setBegrunnelse}
                                    datepickerProps={datepickerProps}
                                    inputProps={inputProps}
                                    eierEllerFølgerSak={eierEllerFølgerSak}
                                />
                            </ExpandingRadio>
                            <ExpandingRadio
                                selected={årsak}
                                value={
                                    nyFlytÅrsakTypeEnum.enum
                                        .VIRKSOMHETEN_ER_FERDIG_VURDERT_MED_INTERN_VURDERING
                                }
                                label="Nav har konkludert"
                            >
                                <InternVurderingInhold
                                    forsøktLagret={forsøktLagret}
                                    begrunnelse={begrunnelse}
                                    setBegrunnelse={setBegrunnelse}
                                    datepickerProps={datepickerProps}
                                    inputProps={inputProps}
                                    eierEllerFølgerSak={eierEllerFølgerSak}
                                />
                            </ExpandingRadio>
                            <ExpandingRadio
                                selected={årsak}
                                value={
                                    nyFlytÅrsakTypeEnum.enum
                                        .VIRKSOMHETEN_ER_FERDIG_VURDERT_OG_TAKKET_NEI
                                }
                                label="Virksomheten har takket nei"
                            >
                                <TakketNeiInnhold
                                    forsøktLagret={forsøktLagret}
                                    begrunnelse={begrunnelse}
                                    setBegrunnelse={setBegrunnelse}
                                    datepickerProps={datepickerProps}
                                    inputProps={inputProps}
                                    eierEllerFølgerSak={eierEllerFølgerSak}
                                />
                            </ExpandingRadio>
                        </VStack>
                    </RadioGroup>
                </Modal.Body>
                {error && (
                    <Modal.Body>
                        <LocalAlert status="error">
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Noe gikk galt
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>{error}</LocalAlert.Content>
                        </LocalAlert>
                    </Modal.Body>
                )}
                {!eierEllerFølgerSak && (
                    <Modal.Body>
                        <LocalAlert
                            status={forsøktLagret ? "error" : "announcement"}
                        >
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Du må være eier eller følger for å avslutte
                                    vurderingen
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                        </LocalAlert>
                    </Modal.Body>
                )}
                <Modal.Footer>
                    <Button
                        onClick={() => {
                            handleSubmit();
                        }}
                        variant="primary"
                        disabled={!kanLagre && forsøktLagret}
                    >
                        Lagre
                    </Button>
                    <Button onClick={onClose} variant="secondary">
                        Avbryt
                    </Button>
                    <Button
                        onClick={() => {
                            setAngreVurderingModalÅpen(true);
                        }}
                        variant="tertiary"
                        icon={<ArrowUndoIcon aria-hidden />}
                    >
                        Angre vurdering
                    </Button>
                </Modal.Footer>
            </Modal>
            <AngreVurderingModal
                virksomhet={virksomhet}
                erÅpen={angreVurderingModalÅpen}
                onClose={() => {
                    setAngreVurderingModalÅpen(false);
                    onClose();
                }}
            />
        </>
    );
}
