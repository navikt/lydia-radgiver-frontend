import {
    HStack,
    Button,
    Tooltip,
    Modal,
    BodyLong,
    CheckboxGroup,
    Checkbox,
    useDatepicker,
    DatePicker,
} from "@navikt/ds-react";
import { ArrowUndoIcon } from "@navikt/aksel-icons";
import React, { useState } from "react";
import { Salesforcelenke } from "../";
import {
    IASak,
    NyFlytBegrunnelse,
    nyFlytBegrunnelseEnum,
    nyFlytÅrsakTypeEnum,
} from "../../../../../domenetyper/domenetyper";
import { Virksomhet } from "../../../../../domenetyper/virksomhet";
import { EierskapKnapp } from "../../../../Virksomhet/Samarbeid/EierskapKnapp";
import {
    angreVurderingNyFlyt,
    avsluttVurderingNyFlyt,
} from "../../../../../api/lydia-api/nyFlyt";

export function VirksomhetVurderes({
    iaSak,
    eierEllerFølgerSak,
    lasterHandling,
    virksomhet,
}: {
    iaSak: IASak;
    eierEllerFølgerSak: boolean;
    lasterHandling: boolean;
    virksomhet: Virksomhet;
}) {
    const [lagrerVurdering, setLagrerVurdering] = useState(false);
    const førsteModalRef = React.useRef<HTMLDialogElement>(null);
    const andreModalRef = React.useRef<HTMLDialogElement>(null);
    const [selectedBegrunnelser, setSelectedBegrunnelser] = useState<
        NyFlytBegrunnelse[]
    >([]);
    const [ønskerSamarbeidSenere, setØnskerSamarbeidSenere] = useState(false);
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 90);
    const { datepickerProps, inputProps, selectedDay } = useDatepicker({
        fromDate: new Date(),
        defaultSelected: defaultDate,
    });

    const onLagreVurdering = () => {
        setLagrerVurdering(true);
        avsluttVurderingNyFlyt(virksomhet.orgnr, {
            type: ønskerSamarbeidSenere
                ? nyFlytÅrsakTypeEnum.enum.VIRKSOMHETEN_SKAL_VURDERES_SENERE
                : nyFlytÅrsakTypeEnum.enum.VIRKSOMHETEN_ER_FERDIG_VURDERT,
            begrunnelser: ønskerSamarbeidSenere
                ? [
                      nyFlytBegrunnelseEnum.enum
                          .VIRKSOMHETEN_ØNSKER_SAMARBEID_SENERE,
                  ]
                : selectedBegrunnelser,
            dato: selectedDay?.toISOString().split("T")[0], // TODO: Hvaslags format skal dette være?
        }).finally(() => {
            setLagrerVurdering(false);
            andreModalRef.current?.close();
        });
    };

    const onAngreVurdering = () => {
        angreVurderingNyFlyt(virksomhet.orgnr);
    };

    return (
        <HStack gap={"4"}>
            {eierEllerFølgerSak ? (
                <>
                    <Button
                        onClick={() => førsteModalRef.current?.showModal?.()}
                        disabled={!eierEllerFølgerSak || lasterHandling}
                        loading={lasterHandling}
                        size="small"
                        variant="secondary"
                    >
                        Avslutt vurdering
                    </Button>
                    <Modal
                        ref={førsteModalRef}
                        header={{
                            heading: "Avslutt vurdering av virksomheten",
                        }}
                    >
                        <Modal.Body>
                            <BodyLong weight="semibold">
                                Velg en eller flere begrunnelser for hvorfor
                                dere avslutter vurderingen av virksomheten.
                            </BodyLong>
                            <CheckboxGroup
                                hideLegend
                                legend="Begrunnelse"
                                value={
                                    ønskerSamarbeidSenere
                                        ? [
                                              nyFlytBegrunnelseEnum.enum
                                                  .VIRKSOMHETEN_ØNSKER_SAMARBEID_SENERE,
                                          ]
                                        : []
                                }
                                onChange={(value) => {
                                    if (
                                        value.includes(
                                            nyFlytBegrunnelseEnum.enum
                                                .VIRKSOMHETEN_ØNSKER_SAMARBEID_SENERE,
                                        )
                                    ) {
                                        setØnskerSamarbeidSenere(true);
                                        setSelectedBegrunnelser([]);
                                    } else {
                                        setØnskerSamarbeidSenere(false);
                                    }
                                }}
                            >
                                <Checkbox
                                    value={
                                        nyFlytBegrunnelseEnum.enum
                                            .VIRKSOMHETEN_ØNSKER_SAMARBEID_SENERE
                                    }
                                >
                                    Virksomheten ønsker samarbeid senere
                                </Checkbox>
                            </CheckboxGroup>
                            <hr />
                            <CheckboxGroup
                                hideLegend
                                legend="Begrunnelse"
                                value={selectedBegrunnelser}
                                onChange={setSelectedBegrunnelser}
                                disabled={ønskerSamarbeidSenere}
                            >
                                <Checkbox
                                    value={
                                        nyFlytBegrunnelseEnum.enum
                                            .VIRKSOMHETEN_HAR_IKKE_SVART
                                    }
                                >
                                    Virksomheten har ikke svart
                                </Checkbox>
                                <Checkbox
                                    value={
                                        nyFlytBegrunnelseEnum.enum
                                            .VIRKSOMHETEN_HAR_TAKKET_NEI
                                    }
                                >
                                    Virksomheten har takket nei
                                </Checkbox>
                                <Checkbox
                                    value={
                                        nyFlytBegrunnelseEnum.enum
                                            .IKKE_DOKUMENTERT_DIALOG_MELLOM_PARTENE
                                    }
                                >
                                    Ikke dokumentert dialog mellom partene
                                </Checkbox>
                                <Checkbox
                                    value={
                                        nyFlytBegrunnelseEnum.enum
                                            .FOR_FÅ_TAPTE_DAGSVERK
                                    }
                                >
                                    For få tapte dagsverk
                                </Checkbox>
                                <Checkbox
                                    value={
                                        nyFlytBegrunnelseEnum.enum
                                            .INTERN_VURDERING_FØR_KONTAKT
                                    }
                                >
                                    Intern vurdering før kontakt med virksomhet
                                </Checkbox>
                                <Checkbox
                                    value={
                                        nyFlytBegrunnelseEnum.enum
                                            .NAV_HAR_IKKE_KAPASITET
                                    }
                                >
                                    Nav har ikke kapasitet
                                </Checkbox>
                            </CheckboxGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                onClick={() => {
                                    førsteModalRef.current?.close();
                                    andreModalRef.current?.showModal?.();
                                }}
                                variant="primary"
                            >
                                Lagre
                            </Button>
                            <Button
                                onClick={() => {
                                    førsteModalRef.current?.close();
                                }}
                                variant="secondary"
                            >
                                Avbryt
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal
                        ref={andreModalRef}
                        header={{
                            heading: ønskerSamarbeidSenere
                                ? "Vurder virksomheten senere"
                                : "Avslutt vurdering av virksomheten",
                        }}
                    >
                        <Modal.Body>
                            <BodyLong weight="semibold">
                                {ønskerSamarbeidSenere
                                    ? "Når ønsker du at virksomheten automatisk skal vurderes igjen? "
                                    : "Hvor lenge skal virksomheten stå som vurdert?"}
                            </BodyLong>
                            <DatePicker {...datepickerProps}>
                                <DatePicker.Input
                                    {...inputProps}
                                    label="Velg varighet"
                                />
                            </DatePicker>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                onClick={onLagreVurdering}
                                variant="primary"
                                loading={lagrerVurdering}
                            >
                                Lagre
                            </Button>
                            <Button
                                onClick={() => {
                                    andreModalRef.current?.close();
                                }}
                                variant="secondary"
                            >
                                Avbryt
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : (
                <>
                    <Tooltip content="Følg eller ta eierskap">
                        <Button disabled size="small" variant="secondary">
                            Avslutt vurdering
                        </Button>
                    </Tooltip>
                    <Button
                        onClick={onAngreVurdering}
                        variant="tertiary"
                        size="small"
                        icon={<ArrowUndoIcon fontSize="1.5rem" aria-hidden />}
                    >
                        Angre vurdering
                    </Button>
                </>
            )}
            <EierskapKnapp iaSak={iaSak} />
            <Salesforcelenke orgnr={virksomhet.orgnr} />
        </HStack>
    );
}
