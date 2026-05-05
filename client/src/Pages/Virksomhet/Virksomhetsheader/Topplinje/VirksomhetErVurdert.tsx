import { DocPencilIcon } from "@navikt/aksel-icons";
import {
    BodyLong,
    Button,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    HStack,
    Modal,
    useDatepicker,
} from "@navikt/ds-react";
import React from "react";
import { useHentBrukerinformasjon } from "@/api/lydia-api/bruker";
import {
    endrePlanlagtDatoNyFlyt,
    vurderSakNyFlyt,
} from "@/api/lydia-api/nyFlyt";
import {
    IASak,
    VirksomhetIATilstandEnum,
    VirksomhetTilstandDto,
} from "@/domenetyper/domenetyper";
import { Virksomhet } from "@/domenetyper/virksomhet";
import { useOversiktMutate } from "@/Pages/Virksomhet/Debugside/Oversikt";
import { EierskapKnapp } from "@/Pages/Virksomhet/Samarbeid/EierskapKnapp";
import { lokalDato } from "@/util/dato";
import { Salesforcelenke } from "..";

export default function VirksomhetErVurdert({
    iaSak,
    virksomhet,
    tilstand,
}: {
    iaSak: IASak;
    virksomhet: Virksomhet;
    tilstand: VirksomhetTilstandDto;
}) {
    if (
        tilstand.nesteTilstand?.nyTilstand ===
        VirksomhetIATilstandEnum.enum.VirksomhetVurderes
    ) {
        return (
            <HStack gap="4">
                <VurderVirksomhetenNå orgnr={virksomhet.orgnr} />
                <VurderesAutomatiskModal
                    tilstand={tilstand}
                    virksomhet={virksomhet}
                />
                <EierskapKnapp iaSak={iaSak} />
                <Salesforcelenke orgnr={virksomhet.orgnr} />
            </HStack>
        );
    } else if (
        tilstand.nesteTilstand?.nyTilstand ===
        VirksomhetIATilstandEnum.enum.VirksomhetKlarTilVurdering
    ) {
        return (
            <HStack gap="4">
                <VurderVirksomhetenNå orgnr={virksomhet.orgnr} />
                <VurdertTilModal tilstand={tilstand} virksomhet={virksomhet} />
                <EierskapKnapp iaSak={iaSak} />
                <Salesforcelenke orgnr={virksomhet.orgnr} />
            </HStack>
        );
    }

    return <div>Virksomheten er vurdert</div>;
}

function VurderVirksomhetenNå({ orgnr }: { orgnr: string }) {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const [senderRequest, setSenderRequest] = React.useState(false);
    const mutate = useOversiktMutate(orgnr);

    const onVurderNå = () => {
        if (!senderRequest) {
            setSenderRequest(true);
            vurderSakNyFlyt(orgnr).finally(() => {
                setSenderRequest(false);
                mutate();
            });
        }
    };

    return (
        <Button
            size="small"
            onClick={onVurderNå}
            loading={senderRequest}
            disabled={!(brukerInformasjon?.rolle === "Superbruker")}
        >
            Vurder nå
        </Button>
    );
}

function VurdertTilModal({
    tilstand,
    virksomhet,
}: {
    tilstand: VirksomhetTilstandDto;
    virksomhet: Virksomhet;
}) {
    const mutate = useOversiktMutate(virksomhet.orgnr);
    const modalRef = React.useRef<HTMLDialogElement>(null);
    const iMorgen = new Date();
    iMorgen.setDate(iMorgen.getDate() + 1);
    const { datepickerProps, inputProps, selectedDay } = useDatepicker({
        fromDate: iMorgen,
        defaultSelected: tilstand.nesteTilstand?.planlagtDato,
    });

    function onLagre() {
        if (!selectedDay || !tilstand.nesteTilstand) {
            modalRef.current?.close();
            return;
        }

        endrePlanlagtDatoNyFlyt(virksomhet.orgnr, {
            startTilstand: tilstand.nesteTilstand.startTilstand,
            planlagtHendelse: tilstand.nesteTilstand.planlagtHendelse,
            nyTilstand: tilstand.nesteTilstand.nyTilstand,
            planlagtDato: selectedDay,
        }).finally(() => {
            mutate();
            modalRef.current?.close();
        });
    }

    if (!tilstand.nesteTilstand) {
        return null;
    }

    return (
        <>
            <Button
                size="small"
                variant="primary-neutral"
                icon={<DocPencilIcon aria-hidden />}
                iconPosition="right"
                onClick={() => modalRef.current?.showModal()}
                style={{
                    backgroundColor: "var(--a-limegreen-50)",
                    color: "var(--a-black)",
                }}
            >
                Vurdert frem til{" "}
                {lokalDato(tilstand.nesteTilstand.planlagtDato)}
            </Button>
            <Modal ref={modalRef} header={{ heading: "Endre dato" }}>
                <Modal.Body>
                    <BodyLong weight="semibold">
                        Virksomheten har status <em>Vurdert</em> frem til angitt
                        dato
                    </BodyLong>
                    <div style={{ marginTop: "2rem" }}>
                        <DatePicker {...datepickerProps}>
                            <DatePicker.Input
                                {...inputProps}
                                label="Sett ny dato"
                            />
                        </DatePicker>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" size="small" onClick={onLagre}>
                        Lagre
                    </Button>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => modalRef.current?.close()}
                    >
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function VurderesAutomatiskModal({
    tilstand,
    virksomhet,
}: {
    tilstand: VirksomhetTilstandDto;
    virksomhet: Virksomhet;
}) {
    const mutate = useOversiktMutate(virksomhet.orgnr);
    const modalRef = React.useRef<HTMLDialogElement>(null);
    const iMorgen = new Date();
    iMorgen.setDate(iMorgen.getDate() + 1);
    const { datepickerProps, inputProps, selectedDay } = useDatepicker({
        fromDate: iMorgen,
        defaultSelected: tilstand.nesteTilstand?.planlagtDato,
    });

    function onLagre() {
        if (!selectedDay || !tilstand.nesteTilstand) {
            modalRef.current?.close();
            return;
        }

        endrePlanlagtDatoNyFlyt(virksomhet.orgnr, {
            startTilstand: tilstand.nesteTilstand.startTilstand,
            planlagtHendelse: tilstand.nesteTilstand.planlagtHendelse,
            nyTilstand: tilstand.nesteTilstand.nyTilstand,
            planlagtDato: selectedDay,
        }).finally(() => {
            mutate();
            modalRef.current?.close();
        });
    }

    if (!tilstand.nesteTilstand) {
        return null;
    }

    return (
        <>
            <Button
                size="small"
                variant="primary-neutral"
                icon={<DocPencilIcon aria-hidden />}
                iconPosition="right"
                onClick={() => modalRef.current?.showModal()}
                style={{
                    backgroundColor: "var(--a-limegreen-50)",
                    color: "var(--a-black)",
                }}
            >
                Vurderes automatisk{" "}
                {lokalDato(tilstand.nesteTilstand.planlagtDato)}
            </Button>
            <Modal ref={modalRef} header={{ heading: "Endre dato" }}>
                <Modal.Body>
                    <BodyLong weight="semibold">
                        Virksomheten vurderes automatisk på angitt dato
                    </BodyLong>
                    <CheckboxGroup
                        legend="Virksomheten ønsker samarbeid senere"
                        defaultValue={["senere"]}
                        hideLegend
                        disabled
                    >
                        <Checkbox value={"senere"}>
                            Virksomheten ønsker samarbeid senere
                        </Checkbox>
                    </CheckboxGroup>
                    <div style={{ marginTop: "1rem" }}>
                        <DatePicker {...datepickerProps}>
                            <DatePicker.Input
                                {...inputProps}
                                label="Sett ny dato"
                            />
                        </DatePicker>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" size="small" onClick={onLagre}>
                        Lagre
                    </Button>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={() => modalRef.current?.close()}
                    >
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
