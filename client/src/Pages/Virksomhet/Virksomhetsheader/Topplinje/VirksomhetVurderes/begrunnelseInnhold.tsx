import {
    Checkbox,
    CheckboxGroup,
    DatePicker,
    Radio,
    RadioGroup,
    useDatepicker,
    VStack,
} from "@navikt/ds-react";
import {
    NyFlytBegrunnelse,
    nyFlytBegrunnelseEnum,
} from "@/domenetyper/domenetyper";

interface BegrunnelseInnholdProps {
    forsøktLagret: boolean;
    begrunnelse: NyFlytBegrunnelse[];
    setBegrunnelse: (begrunnelse: NyFlytBegrunnelse[]) => void;
    datepickerProps: ReturnType<typeof useDatepicker>["datepickerProps"];
    inputProps: ReturnType<typeof useDatepicker>["inputProps"];
    eierEllerFølgerSak: boolean;
}

export function VurderesSenereInnhold({
    forsøktLagret,
    begrunnelse,
    setBegrunnelse,
    datepickerProps,
    inputProps,
    eierEllerFølgerSak,
}: BegrunnelseInnholdProps) {
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

export function InternVurderingInhold({
    forsøktLagret,
    begrunnelse,
    setBegrunnelse,
    datepickerProps,
    inputProps,
    eierEllerFølgerSak,
}: BegrunnelseInnholdProps) {
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

export function TakketNeiInnhold({
    forsøktLagret,
    begrunnelse,
    setBegrunnelse,
    datepickerProps,
    inputProps,
    eierEllerFølgerSak,
}: BegrunnelseInnholdProps) {
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
