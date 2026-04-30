import { ArrowUndoIcon } from "@navikt/aksel-icons";
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
    Tooltip,
} from "@navikt/ds-react";
import React, { useState } from "react";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "@/api/lydia-api/bruker";
import {
    angreVurderingNyFlyt,
    avsluttVurderingNyFlyt,
} from "@/api/lydia-api/nyFlyt";
import { useHentTeam } from "@/api/lydia-api/team";
import {
    IASak,
    NyFlytBegrunnelse,
    nyFlytBegrunnelseEnum,
    NyFlytÅrsakType,
    nyFlytÅrsakTypeEnum,
} from "@/domenetyper/domenetyper";
import { Virksomhet } from "@/domenetyper/virksomhet";
import { useOversiktMutate } from "@/Pages/Virksomhet/Debugside/Oversikt";
import { EierskapKnapp } from "@/Pages/Virksomhet/Samarbeid/EierskapKnapp";
import { useErPåInaktivSak } from "@/Pages/Virksomhet/VirksomhetContext";
import { isoDato } from "@/util/dato";
import { Salesforcelenke } from "../";

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
                erSuperbruker={brukerInformasjon?.rolle === "Superbruker"}
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
    forsøktLagret,
    begrunnelse,
    setBegrunnelse,
    datepickerProps,
    inputProps,
    eierEllerFølgerSak,
}: {
    forsøktLagret: boolean;
    begrunnelse: NyFlytBegrunnelse[];
    setBegrunnelse: (begrunnelse: NyFlytBegrunnelse[]) => void;
    datepickerProps: ReturnType<typeof useDatepicker>["datepickerProps"];
    inputProps: ReturnType<typeof useDatepicker>["inputProps"];
    eierEllerFølgerSak: boolean;
}) {
    return (
        <VStack gap="space-16">
            <RadioGroup
                legend="Begrunnelse for å vurdere senere"
                hideLegend
                value={begrunnelse?.[0]}
                error={
                    forsøktLagret &&
                    begrunnelse.length === 0 &&
                    eierEllerFølgerSak
                        ? "Du må velge en begrunnelse for å vurdere senere"
                        : undefined
                }
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
                    Nav har ikke kapasitet nå
                </Radio>
            </RadioGroup>
            <DatePicker {...datepickerProps}>
                <DatePicker.Input
                    {...inputProps}
                    label="Når skal virksomheten automatisk vurderes igjen?"
                />
            </DatePicker>
        </VStack>
    );
}

function InternVurderingInhold({
    forsøktLagret,
    begrunnelse,
    setBegrunnelse,
    datepickerProps,
    inputProps,
    eierEllerFølgerSak,
}: {
    forsøktLagret: boolean;
    begrunnelse: NyFlytBegrunnelse[];
    setBegrunnelse: (begrunnelse: NyFlytBegrunnelse[]) => void;
    datepickerProps: ReturnType<typeof useDatepicker>["datepickerProps"];
    inputProps: ReturnType<typeof useDatepicker>["inputProps"];
    eierEllerFølgerSak: boolean;
}) {
    return (
        <VStack gap="space-16">
            <CheckboxGroup
                error={
                    forsøktLagret &&
                    begrunnelse.length === 0 &&
                    eierEllerFølgerSak
                        ? "Du må velge en begrunnelse for å avslutte vurderingen"
                        : undefined
                }
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
                    label="Hvor lenge skal virksomheten ha status Vurdert?"
                />
            </DatePicker>
        </VStack>
    );
}

function TakketNeiInnhold({
    forsøktLagret,
    begrunnelse,
    setBegrunnelse,
    datepickerProps,
    inputProps,
    eierEllerFølgerSak,
}: {
    forsøktLagret: boolean;
    begrunnelse: NyFlytBegrunnelse[];
    setBegrunnelse: (begrunnelse: NyFlytBegrunnelse[]) => void;
    datepickerProps: ReturnType<typeof useDatepicker>["datepickerProps"];
    inputProps: ReturnType<typeof useDatepicker>["inputProps"];
    eierEllerFølgerSak: boolean;
}) {
    return (
        <VStack gap="space-16">
            <CheckboxGroup
                legend="Virksomheten har takket nei"
                error={
                    forsøktLagret &&
                    begrunnelse.length === 0 &&
                    eierEllerFølgerSak
                        ? "Du må velge en begrunnelse for å avslutte vurdering"
                        : undefined
                }
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
                    label="Hvor lenge skal virksomheten ha status Vurdert?"
                />
            </DatePicker>
        </VStack>
    );
}

function AngreVurderingModal({
    virksomhet,
    erÅpen,
    onClose,
}: {
    virksomhet: Virksomhet;
    erÅpen: boolean;
    onClose: () => void;
}) {
    const mutate = useOversiktMutate(virksomhet.orgnr);
    const [lagrer, setLagrer] = useState(false);
    const [error, setError] = useState<string>();

    const onAngreVurdering = () => {
        setLagrer(true);
        angreVurderingNyFlyt(virksomhet.orgnr)
            .then(() => {
                mutate();
                onClose();
            })
            .catch((error) => {
                setError(
                    error.message || "Noe gikk galt ved angre vurderingen",
                );
            })
            .finally(() => {
                setLagrer(false);
            });
    };

    return (
        <Modal
            open={erÅpen}
            onClose={onClose}
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
                                Kunne ikke angre vurderingen
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

                        onClose();
                    }}
                    variant="secondary"
                >
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
