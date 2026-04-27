import React from "react";
import {
    BodyLong,
    Button,
    DatePicker,
    HStack,
    Modal,
    useDatepicker,
} from "@navikt/ds-react";
import {
    IASak,
    VirksomhetTilstandDto,
} from "../../../../domenetyper/domenetyper";
import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { EierskapKnapp } from "../../Samarbeid/EierskapKnapp";
import { Salesforcelenke } from "..";
import { lokalDato } from "../../../../util/dato";
import VurderVirksomhetKnapp from "./common/VurderVirksomhetKnapp";
import { DocPencilIcon } from "@navikt/aksel-icons";
import { endrePlanlagtDatoNyFlyt } from "../../../../api/lydia-api/nyFlyt";
import { useOversiktMutate } from "../../Debugside/Oversikt";

export default function AlleSamarbeidIVirksomhetErAvsluttet({
    iaSak,
    virksomhet,
    tilstand,
}: {
    iaSak: IASak;
    virksomhet: Virksomhet;
    tilstand: VirksomhetTilstandDto;
}) {
    return (
        <HStack gap="4">
            <VurderVirksomhetKnapp virksomhet={virksomhet} label="Vurder nå" />
            <AvsluttetFremTilModal
                tilstand={tilstand}
                virksomhet={virksomhet}
            />
            <EierskapKnapp iaSak={iaSak} />
            <Salesforcelenke orgnr={virksomhet.orgnr} />
        </HStack>
    );
}

function AvsluttetFremTilModal({
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
                    backgroundColor: "var(--a-gray-50)",
                    color: "var(--a-black)",
                }}
            >
                Avsluttet frem til{" "}
                {lokalDato(tilstand.nesteTilstand.planlagtDato)}
            </Button>
            <Modal ref={modalRef} header={{ heading: "Endre dato" }}>
                <Modal.Body>
                    <BodyLong weight="semibold">
                        Virksomheten har status <em>Avsluttet</em> frem til
                        angitt dato
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
