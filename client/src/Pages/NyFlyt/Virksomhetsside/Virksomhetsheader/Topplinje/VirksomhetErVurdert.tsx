import React from "react";
import {
    BodyLong,
    Button,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    HStack,
    Modal,
    Tag,
    useDatepicker,
} from "@navikt/ds-react";
import {
    IASak,
    VirksomhetIATilstandEnum,
    VirksomhetTilstandDto,
} from "../../../../../domenetyper/domenetyper";
import { Virksomhet } from "../../../../../domenetyper/virksomhet";
import { lokalDato } from "../../../../../util/dato";
import { DocPencilIcon } from "@navikt/aksel-icons";
import { EierskapKnapp } from "../../../../Virksomhet/Samarbeid/EierskapKnapp";
import { Salesforcelenke } from "..";
import {
    endrePlanlagtDatoNyFlyt,
    vurderSakNyFlyt,
} from "../../../../../api/lydia-api/nyFlyt";

export default function VirksomhetErVurdert({
    iaSak,
    virksomhet,
    tilstand,
}: {
    iaSak: IASak;
    virksomhet: Virksomhet;
    tilstand: VirksomhetTilstandDto;
}) {
    console.log("tilstand", tilstand);
    if (
        tilstand.nesteTilstand?.nyTilstand ===
        VirksomhetIATilstandEnum.enum.VirksomhetVurderes
    ) {
        return (
            <HStack gap="4">
                <VurderesAutomatiskModal
                    tilstand={tilstand}
                    iaSak={iaSak}
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
                <VurdertTil tilstand={tilstand} />
                <EierskapKnapp iaSak={iaSak} />
                <Salesforcelenke orgnr={virksomhet.orgnr} />
            </HStack>
        );
    }

    return <div>Virksomheten er vurdert</div>;
}

function VurderVirksomhetenNå({ orgnr }: { orgnr: string }) {
    const [senderRequest, setSenderRequest] = React.useState(false);

    const onVurderNå = () => {
        if (!senderRequest) {
            setSenderRequest(true);
            vurderSakNyFlyt(orgnr).finally(() => {
                setSenderRequest(false);
            });
        }
    };

    return (
        <Button size="small" onClick={onVurderNå} loading={senderRequest}>
            Vurder nå
        </Button>
    );
}

function VurdertTil({ tilstand }: { tilstand: VirksomhetTilstandDto }) {
    if (!tilstand.nesteTilstand) {
        return null;
    }

    return (
        <Tag size="small" variant="neutral-moderate">
            Vurdert frem til {lokalDato(tilstand.nesteTilstand.planlagtDato)}
        </Tag>
    );
}

function VurderesAutomatiskModal({
    tilstand,
    virksomhet,
}: {
    tilstand: VirksomhetTilstandDto;
    iaSak: IASak;
    virksomhet: Virksomhet;
}) {
    const modalRef = React.useRef<HTMLDialogElement>(null);
    const { datepickerProps, inputProps, selectedDay } = useDatepicker({
        fromDate: new Date(),
        defaultSelected: tilstand.nesteTilstand?.planlagtDato,
    });

    function onVurderNå() {
        vurderSakNyFlyt(virksomhet.orgnr).finally(() => {
            modalRef.current?.close();
        });
    }

    function onLagre() {
        // TODO: Koble til når vi får endepunkt.
        if (!selectedDay) {
            modalRef.current?.close();
            return;
        }

        if (!tilstand.nesteTilstand) {
            modalRef.current?.close();
            return;
        }

        endrePlanlagtDatoNyFlyt(virksomhet.orgnr, {
            startTilstand: tilstand.nesteTilstand.startTilstand,
            planlagtHendelse: tilstand.nesteTilstand.planlagtHendelse,
            nyTilstand: tilstand.nesteTilstand.nyTilstand,
            planlagtDato: selectedDay,
        }).finally(() => {
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
            >
                Vurderes automatisk{" "}
                {lokalDato(tilstand.nesteTilstand.planlagtDato)}
            </Button>
            <Modal ref={modalRef} header={{ heading: "Vurder virksomheten" }}>
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
                    <DatePicker {...datepickerProps}>
                        <DatePicker.Input {...inputProps} label="Endre dato" />
                    </DatePicker>
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
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={onVurderNå}
                    >
                        Vurder nå
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
