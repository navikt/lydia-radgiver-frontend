import { Checkbox, CheckboxGroup, DatePicker, HStack, useDatepicker } from "@navikt/ds-react";
import styled from "styled-components";
import { RedigertInnholdMal } from "../../../domenetyper/plan";
import React from "react";

const UndertemaRad = styled(HStack)`
    margin-bottom: 0.5rem;
    min-width: 48rem;
`;

const FIRST_VALID_DATE = "Jan 1 2023";
const LAST_VALID_DATE = "Jan 1 2028";

function StartOgSluttVelger({
    redigertInnholdMal,
    setNyStartDato,
    setNySluttDato,
}: {
    redigertInnholdMal: RedigertInnholdMal;
    setNyStartDato: (date: Date) => void;
    setNySluttDato: (date: Date) => void;
}) {
    const datepickerFrom = useDatepicker({
        defaultSelected: redigertInnholdMal.startDato ?? undefined,
        fromDate: new Date(FIRST_VALID_DATE),
        toDate: new Date(redigertInnholdMal.sluttDato ?? LAST_VALID_DATE),
        onDateChange: (date) => {
            if (date) {
                setNyStartDato(date);
            }
        },
    });

    const datepickerTo = useDatepicker({
        defaultSelected: redigertInnholdMal.sluttDato ?? undefined,
        fromDate: new Date(redigertInnholdMal.startDato ?? FIRST_VALID_DATE),
        toDate: new Date(LAST_VALID_DATE),
        onDateChange: (date) => {
            if (date) {
                setNySluttDato(date);
            }
        },
    });

    return (
        <HStack align="center" gap="3">
            <DatePicker {...datepickerFrom.datepickerProps} dropdownCaption>
                <DatePicker.Input
                    hideLabel
                    size="small"
                    label={`Startdato for ${redigertInnholdMal.navn}`}
                    {...datepickerFrom.inputProps}
                />
            </DatePicker>
            <DatePicker {...datepickerTo.datepickerProps} dropdownCaption>
                <DatePicker.Input
                    hideLabel
                    size="small"
                    label={`Sluttdato for ${redigertInnholdMal.navn}`}
                    {...datepickerTo.inputProps}
                />
            </DatePicker>
        </HStack>
    );
}

export default function TemaInnholdVelger({
    valgteUndertemaer,
    velgUndertemaer,
    setVisInnholdFeil,
    visInnholdFeil,
}: {
    valgteUndertemaer: RedigertInnholdMal[];
    velgUndertemaer: (val: RedigertInnholdMal[]) => void;
    setVisInnholdFeil: (val: boolean) => void;
    visInnholdFeil: boolean;
}) {
    const planleggUndertema = (undertemaIder: number[]) => {
        velgUndertemaer(
            valgteUndertemaer.map((redigertInnholdMal) =>
                undertemaIder.includes(redigertInnholdMal.rekkefølge)
                    ? { ...redigertInnholdMal, planlagt: true }
                    : {
                        ...redigertInnholdMal,
                        planlagt: false,
                        startDato: null,
                        sluttDato: null,
                    },
            ),
        );
    };

    const setNyStartDato = (rekkefølge: number, date: Date) => {
        velgUndertemaer(
            valgteUndertemaer.map((innhold) =>
                innhold.rekkefølge === rekkefølge
                    ? { ...innhold, startDato: date }
                    : { ...innhold },
            ),
        );
    };

    const setNySluttDato = (rekkefølge: number, date: Date) => {
        velgUndertemaer(
            valgteUndertemaer.map((innhold) =>
                innhold.rekkefølge === rekkefølge
                    ? { ...innhold, sluttDato: date }
                    : { ...innhold },
            ),
        );
    };

    return (
        <CheckboxGroup
            legend={"Velg innhold og varighet"}
            value={valgteUndertemaer
                .filter((undertema) => undertema.planlagt)
                .map((undertema) => undertema.rekkefølge)}
            error={
                visInnholdFeil
                    ? "Du må velge noe innhold for å opprette en plan"
                    : null
            }
            onChange={(val: number[]) => {
                planleggUndertema(val);
                setVisInnholdFeil(false);
            }}
        >
            {valgteUndertemaer.map((redigertInnholdMal) => {
                return (
                    <UndertemaRad
                        key={redigertInnholdMal.rekkefølge}
                        justify="space-between"
                        gap="4"
                        align="center"
                    >
                        <Checkbox
                            key={redigertInnholdMal.rekkefølge}
                            value={redigertInnholdMal.rekkefølge}
                        >
                            {redigertInnholdMal.navn}
                        </Checkbox>
                        {redigertInnholdMal.planlagt ? (
                            <StartOgSluttVelger
                                redigertInnholdMal={redigertInnholdMal}
                                setNyStartDato={(date) =>
                                    setNyStartDato(
                                        redigertInnholdMal.rekkefølge,
                                        date,
                                    )
                                }
                                setNySluttDato={(date) =>
                                    setNySluttDato(
                                        redigertInnholdMal.rekkefølge,
                                        date,
                                    )
                                }
                            />
                        ) : undefined}
                    </UndertemaRad>
                );
            })}
        </CheckboxGroup>
    );
}
