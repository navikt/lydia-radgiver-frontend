import {
    HStack,
    Button,
    Modal,
    CheckboxGroup,
    Checkbox,
    useDatepicker,
    DatePicker,
    Box,
    VStack,
    RadioGroup,
    Radio,
    LocalAlert,
} from "@navikt/ds-react";
import React, { useState } from "react";
import { Salesforcelenke } from "../";
import {
    IASak,
    NyFlytBegrunnelse,
    nyFlytBegrunnelseEnum,
    NyFlytÅrsakType,
    nyFlytÅrsakTypeEnum,
} from "../../../../domenetyper/domenetyper";
import { Virksomhet } from "../../../../domenetyper/virksomhet";
import { EierskapKnapp } from "../../Samarbeid/EierskapKnapp";
import { ArrowUndoIcon } from "@navikt/aksel-icons";
import {
    angreVurderingNyFlyt,
    avsluttVurderingNyFlyt,
} from "../../../../api/lydia-api/nyFlyt";
import { useOversiktMutate } from "../../Debugside/Oversikt";

import { useErPåInaktivSak } from "../../VirksomhetContext";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "../../../../api/lydia-api/bruker";
import { useHentTeam } from "../../../../api/lydia-api/team";

export function VirksomhetVurderes({
    iaSak,
    virksomhet,
}: {
    iaSak: IASak;
    virksomhet: Virksomhet;
}) {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
    const brukerFølgerSak = følgere.some(
        (følger) => følger === brukerInformasjon?.ident,
    );
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const eierEllerFølgerSak =
        (erSaksbehandler(brukerInformasjon) && brukerFølgerSak) ||
        brukerErEierAvSak;

    return (
        <HStack gap={"4"}>
            <AvsluttVurderingModal
                virksomhet={virksomhet}
                eierEllerFølgerSak={eierEllerFølgerSak}
            />
            <EierskapKnapp iaSak={iaSak} />
            <Salesforcelenke orgnr={virksomhet.orgnr} />
        </HStack>
    );
}

function AvsluttVurderingModal({
    virksomhet,
    eierEllerFølgerSak,
}: {
    virksomhet: Virksomhet;
    eierEllerFølgerSak: boolean;
}) {
    const erPåInaktivSak = useErPåInaktivSak();
    const modalRef = React.createRef<HTMLDialogElement | null>();

    if (erPåInaktivSak) {
        return (
            <Button disabled size="small" variant="secondary">
                Avslutt vurdering
            </Button>
        );
    }

    return (
        <>
            <Button
                onClick={() => modalRef.current?.showModal?.()}
                size="small"
                variant="secondary"
            >
                Avslutt vurdering
            </Button>
            <AvsluttVurderingModalInnhold
                ref={modalRef}
                virksomhet={virksomhet}
                eierEllerFølgerSak={eierEllerFølgerSak}
            />
        </>
    );
}

function AvsluttVurderingModalInnhold({
    ref,
    virksomhet,
    eierEllerFølgerSak,
}: {
    ref: React.RefObject<HTMLDialogElement | null>;
    virksomhet: Virksomhet;
    eierEllerFølgerSak: boolean;
}) {
    const mutate = useOversiktMutate(virksomhet.orgnr);
    const angreVurderingModalRef = React.createRef<HTMLDialogElement | null>();
    const [error, setError] = useState<string | null>();
    const [årsak, setÅrsak] = useState<NyFlytÅrsakType>();
    const [begrunnelse, setBegrunnelse] = useState<NyFlytBegrunnelse[]>([]);
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 90);
    const {
        datepickerProps,
        inputProps,
        selectedDay,
        reset: resetDatepicker,
    } = useDatepicker({
        fromDate: new Date(),
        defaultSelected: defaultDate,
    });

    const handleSubmit = async () => {
        setError(null);
        try {
            if (!årsak) {
                setError("Du må velge en årsak for å avslutte vurderingen");
                return;
            }
            if (!selectedDay) {
                setError("Du må velge en dato for å avslutte vurderingen");
                return;
            }

            await avsluttVurderingNyFlyt(virksomhet.orgnr, {
                type: årsak,
                begrunnelser: begrunnelse,
                dato: selectedDay
                    ? selectedDay.toISOString().split("T")[0]
                    : undefined, // TODO: Hvaslags format skal dette være?
            });

            mutate();
            ref.current?.close();
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    const kanLagre = React.useMemo(() => {
        if (!eierEllerFølgerSak) {
            return false;
        }
        if (!årsak) {
            return false;
        }
        if (
            årsak ===
            nyFlytÅrsakTypeEnum.enum
                .VIRKSOMHETEN_VURDERES_PÅ_ET_SENERE_TIDSPUNKT
        ) {
            return (
                begrunnelse.length > 0 &&
                selectedDay &&
                selectedDay > new Date()
            );
        }
        if (
            årsak ===
                nyFlytÅrsakTypeEnum.enum
                    .VIRKSOMHETEN_ER_FERDIG_VURDERT_MED_INTERN_VURDERING ||
            årsak ===
                nyFlytÅrsakTypeEnum.enum
                    .VIRKSOMHETEN_ER_FERDIG_VURDERT_OG_TAKKET_NEI
        ) {
            return begrunnelse.length > 0 && selectedDay;
        }
        return false;
    }, [årsak, begrunnelse, selectedDay]);

    return (
        <>
            <Modal
                ref={ref}
                header={{
                    heading: "Avslutt vurdering av virksomheten",
                }}
                width="medium"
            >
                <Modal.Body>
                    <RadioGroup
                        onChange={(value) => {
                            setBegrunnelse([]);
                            setÅrsak(value as NyFlytÅrsakType);
                            resetDatepicker();
                        }}
                        value={årsak}
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
                                    begrunnelse={begrunnelse}
                                    setBegrunnelse={setBegrunnelse}
                                    datepickerProps={datepickerProps}
                                    inputProps={inputProps}
                                />
                            </ExpandingRadio>
                            <ExpandingRadio
                                selected={årsak}
                                value={
                                    nyFlytÅrsakTypeEnum.enum
                                        .VIRKSOMHETEN_ER_FERDIG_VURDERT_MED_INTERN_VURDERING
                                }
                                label="Virksomheten er ferdig vurdert med intern vurdering"
                            >
                                <InternVurderingInhold
                                    begrunnelse={begrunnelse}
                                    setBegrunnelse={setBegrunnelse}
                                    datepickerProps={datepickerProps}
                                    inputProps={inputProps}
                                />
                            </ExpandingRadio>
                            <ExpandingRadio
                                selected={årsak}
                                value={
                                    nyFlytÅrsakTypeEnum.enum
                                        .VIRKSOMHETEN_ER_FERDIG_VURDERT_OG_TAKKET_NEI
                                }
                                label="Virksomheten er ferdig vurdert og takket nei"
                            >
                                <TakketNeiInnhold
                                    begrunnelse={begrunnelse}
                                    setBegrunnelse={setBegrunnelse}
                                    datepickerProps={datepickerProps}
                                    inputProps={inputProps}
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
                        <LocalAlert status="warning">
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Du må eie eller følge saken for å kunne
                                    avslutte vurderingen
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
                        disabled={!kanLagre}
                    >
                        Lagre
                    </Button>
                    <Button
                        onClick={() => {
                            ref.current?.close();
                        }}
                        variant="secondary"
                    >
                        Avbryt
                    </Button>
                    <Button
                        onClick={() => {
                            angreVurderingModalRef.current?.showModal();
                            ref.current?.close();
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
                ref={angreVurderingModalRef}
            />
        </>
    );
}

function ExpandingRadio({
    value,
    label,
    selected,
    children,
}: {
    value: string;
    label: string;
    selected?: string;
    children: React.ReactNode;
}) {
    return (
        <Box
            padding="space-16"
            borderRadius="xlarge"
            background="surface-alt-2-subtle"
        >
            <Radio value={value}>{label}</Radio>
            {selected === value && (
                <Box paddingInline="space-32">{children}</Box>
            )}
        </Box>
    );
}

function VurderesSenereInnhold({
    begrunnelse,
    setBegrunnelse,
    datepickerProps,
    inputProps,
}: {
    begrunnelse: NyFlytBegrunnelse[];
    setBegrunnelse: (begrunnelse: NyFlytBegrunnelse[]) => void;
    datepickerProps: ReturnType<typeof useDatepicker>["datepickerProps"];
    inputProps: ReturnType<typeof useDatepicker>["inputProps"];
}) {
    return (
        <VStack gap="space-16">
            <RadioGroup
                legend="Begrunnelse for å vurdere senere"
                hideLegend
                value={begrunnelse?.[0]}
                onChange={(value) =>
                    setBegrunnelse([value as NyFlytBegrunnelse])
                }
            >
                <Radio
                    value={
                        nyFlytBegrunnelseEnum.enum
                            .VIRKSOMHETEN_ØNSKER_Å_BLI_KONTAKTET_SENERE
                    }
                >
                    Virksomheten ønsker å bli kontaktet senere
                </Radio>
                <Radio
                    value={nyFlytBegrunnelseEnum.enum.NAV_HAR_IKKE_KAPASITET_NÅ}
                >
                    NAV har ikke kapasitet nå
                </Radio>
            </RadioGroup>
            <DatePicker {...datepickerProps}>
                <DatePicker.Input
                    {...inputProps}
                    label="Når skal virksomheten settes til vurderes igjen?"
                />
            </DatePicker>
        </VStack>
    );
}

function InternVurderingInhold({
    begrunnelse,
    setBegrunnelse,
    datepickerProps,
    inputProps,
}: {
    begrunnelse: NyFlytBegrunnelse[];
    setBegrunnelse: (begrunnelse: NyFlytBegrunnelse[]) => void;
    datepickerProps: ReturnType<typeof useDatepicker>["datepickerProps"];
    inputProps: ReturnType<typeof useDatepicker>["inputProps"];
}) {
    return (
        <>
            <CheckboxGroup
                legend="Intern vurdering"
                hideLegend
                value={begrunnelse}
                onChange={setBegrunnelse}
            >
                <Checkbox
                    value={
                        nyFlytBegrunnelseEnum.enum
                            .VIRKSOMHETEN_HAR_IKKE_SVART_PÅ_HENVENDELSER
                    }
                >
                    Virksomheten har ikke svart på henvendelser
                </Checkbox>
                <Checkbox
                    value={
                        nyFlytBegrunnelseEnum.enum
                            .VIRKSOMHETEN_HAR_FOR_LAVT_POTENSIALE
                    }
                >
                    Virksomheten har for lavt potensiale til å redusere tapte
                    dagsverk
                </Checkbox>
                <Checkbox
                    value={
                        nyFlytBegrunnelseEnum.enum
                            .VIRKSOMHETEN_MANGLER_REPRESANTANTER_ELLER_ETABLERT_PARTSGRUPPE
                    }
                >
                    Virksomheten mangler representanter eller etablert
                    partsgruppe
                </Checkbox>
            </CheckboxGroup>
            <DatePicker {...datepickerProps}>
                <DatePicker.Input
                    {...inputProps}
                    label="Hvor lenge ønsker du at virksomheten skal ha status Vurdert?"
                />
            </DatePicker>
        </>
    );
}

function TakketNeiInnhold({
    begrunnelse,
    setBegrunnelse,
    datepickerProps,
    inputProps,
}: {
    begrunnelse: NyFlytBegrunnelse[];
    setBegrunnelse: (begrunnelse: NyFlytBegrunnelse[]) => void;
    datepickerProps: ReturnType<typeof useDatepicker>["datepickerProps"];
    inputProps: ReturnType<typeof useDatepicker>["inputProps"];
}) {
    return (
        <>
            <CheckboxGroup
                legend="Virksomheten har takket nei"
                hideLegend
                value={begrunnelse}
                onChange={setBegrunnelse}
            >
                <Checkbox
                    value={
                        nyFlytBegrunnelseEnum.enum
                            .VIRKSOMHETEN_ER_IKKE_MOTIVERT_ELLER_HAR_IKKE_KAPASITET
                    }
                >
                    Virksomheten er ikke motivert eller har ikke kapasitet
                </Checkbox>
                <Checkbox
                    value={
                        nyFlytBegrunnelseEnum.enum
                            .VIRKSOMHETEN_SAMARBEIDER_MED_ANDRE_ELLER_GJØR_EGNE_TILTAK
                    }
                >
                    Virksomheten samarbeider med andre eller gjør egne tiltak
                </Checkbox>
                <Checkbox
                    value={
                        nyFlytBegrunnelseEnum.enum
                            .VIRKSOMHETEN_ØNSKER_KUN_INFORMASJON_OG_VEILEDNING
                    }
                >
                    Virksomheten ønsker kun informasjon og veiledning
                </Checkbox>
                <Checkbox
                    value={
                        nyFlytBegrunnelseEnum.enum
                            .KOMMUNEN_ELLER_OVERORDNET_LEDELSE_ØNSKER_IKKE_Å_STARTE_ET_SAMARBEID
                    }
                >
                    Kommunen/overordnet ledelse ønsker ikke å starte samarbeid
                </Checkbox>
                <Checkbox
                    value={
                        nyFlytBegrunnelseEnum.enum
                            .VIRKSOMHETEN_FERDIG_VURDERT_TAKKET_NEI_ANNET
                    }
                >
                    Annet
                </Checkbox>
            </CheckboxGroup>
            <DatePicker {...datepickerProps}>
                <DatePicker.Input
                    {...inputProps}
                    label="Hvor lenge ønsker du at virksomheten skal ha status Vurdert?"
                />
            </DatePicker>
        </>
    );
}

function AngreVurderingModal({
    virksomhet,
    ref,
}: {
    virksomhet: Virksomhet;
    ref: React.RefObject<HTMLDialogElement | null>;
}) {
    const mutate = useOversiktMutate(virksomhet.orgnr);
    const [lagrer, setLagrer] = useState(false);
    const [error, setError] = useState<string>();

    const onAngreVurdering = () => {
        setLagrer(true);
        angreVurderingNyFlyt(virksomhet.orgnr)
            .then(() => {
                mutate();
                ref?.current?.close();
            })
            .catch((error) => {
                setError(error.message || "Noe gikk galt ved angre vurdering");
            })
            .finally(() => {
                setLagrer(false);
            });
    };

    return (
        <Modal
            ref={ref}
            header={{
                heading: "Angre vurdering",
            }}
            width="small"
        >
            <Modal.Body>
                Er du sikker på at du vil angre vurderingen? Dette vil slette
                historikken og følgere blir fjernet fra virksomheten.
            </Modal.Body>
            {error && (
                <Modal.Body>
                    <LocalAlert status="error">
                        <LocalAlert.Header>
                            <LocalAlert.Title>
                                Kunne ikke angre vurdering
                            </LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>{error}</LocalAlert.Content>
                    </LocalAlert>
                </Modal.Body>
            )}
            <Modal.Footer>
                <Button
                    onClick={onAngreVurdering}
                    variant="primary"
                    disabled={error !== undefined}
                    loading={lagrer}
                >
                    Angre vurdering
                </Button>
                <Button
                    onClick={() => {
                        if (error) {
                            setError(undefined);
                        }

                        ref?.current?.close();
                    }}
                    variant="secondary"
                >
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
