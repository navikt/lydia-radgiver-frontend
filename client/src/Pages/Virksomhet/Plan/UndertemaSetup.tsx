import { Checkbox, CheckboxGroup, HStack, DatePicker, useDatepicker } from "@navikt/ds-react";
import styled from "styled-components";
import { PlanInnhold } from "../../../domenetyper/plan";
import React from "react";

const UndertemaRad = styled(HStack)`
    margin-bottom: 0.5rem;
    min-width: 48rem;
`;


// Noe ødelegger --a-spacing-6 så vi setter det manuelt. Bør ta en titt og finne ut hva som ødelegger det senere.
const StyledHStack = styled(HStack)`
    --a-spacing-6: 1.5rem;
`;

const FIRST_VALID_DATE = "Jan 1 2023";
const LAST_VALID_DATE = "Jan 1 2028";

function StartOgSluttVelger({
    undertema,
    setNyStartDato,
    setNySluttDato,
}: {
    undertema: PlanInnhold;
    setNyStartDato: (date: Date) => void;
    setNySluttDato: (date: Date) => void;
}) {
    const datepickerFrom = useDatepicker({
        defaultSelected: undertema.startDato ?? undefined,
        fromDate: new Date(FIRST_VALID_DATE),
        toDate: new Date(undertema.sluttDato ?? LAST_VALID_DATE),
        onDateChange: (date) => {
            if (date) {
                setNyStartDato(date);
            }
        }
    });
    const datepickerTo = useDatepicker({
        defaultSelected: undertema.sluttDato ?? undefined,
        fromDate: new Date(undertema.startDato ?? FIRST_VALID_DATE),
        toDate: new Date(LAST_VALID_DATE),
        onDateChange: (date) => {
            if (date) {
                setNySluttDato(date);
            }
        },
    });

    return (
        <StyledHStack wrap gap="4" justify="center">
            <DatePicker {...datepickerFrom.datepickerProps} dropdownCaption>
                <DatePicker.Input
                    hideLabel
                    size="small"
                    label={`Startdato for ${undertema.navn}`}
                    {...datepickerFrom.inputProps}
                />
            </DatePicker>
            <DatePicker {...datepickerTo.datepickerProps} dropdownCaption>
                <DatePicker.Input
                    hideLabel
                    size="small"
                    label={`Sluttdato for ${undertema.navn}`}
                    {...datepickerTo.inputProps}
                />
            </DatePicker>
        </StyledHStack>
    );
}

interface UndertemaSetupProps {
    valgteUndertemaer: PlanInnhold[];
    velgUndertemaer: (val: PlanInnhold[]) => void;
}

export default function UndertemaSetup({
    valgteUndertemaer,
    velgUndertemaer,
}: UndertemaSetupProps) {
    const planleggUndertema = (undertemaIder: number[]) => {
        velgUndertemaer(
            valgteUndertemaer.map((undertema) =>
                undertemaIder.includes(undertema.id)
                    ? { ...undertema, planlagt: true, status: "PLANLAGT" }
                    : {
                        ...undertema,
                        planlagt: false,
                        startDato: null,
                        sluttDato: null,
                        status: null,
                    },
            ),
        );
    };

    const setNyStartDato = (undertemaId: number, date: Date) => {
        velgUndertemaer(
            valgteUndertemaer.map((undertema) =>
                undertema.id === undertemaId
                    ? { ...undertema, startDato: date }
                    : { ...undertema },
            ),
        );
    };

    const setNySluttDato = (undertemaId: number, date: Date) => {
        velgUndertemaer(
            valgteUndertemaer.map((undertema) =>
                undertema.id === undertemaId
                    ? { ...undertema, sluttDato: date }
                    : { ...undertema },
            ),
        );
    };

    return (
        <CheckboxGroup
            legend={"Velg innhold og varighet"}
            value={valgteUndertemaer
                .filter((undertema) => undertema.planlagt)
                .map((undertema) => undertema.id)}
            onChange={planleggUndertema}
        >
            {valgteUndertemaer
                .sort((a, b) => {
                    return a.id - b.id;
                })
                .map((undertema) => {
                    return (
                        <UndertemaRad
                            key={undertema.id}
                            justify="space-between"
                            gap="4"
                            align="center"
                        >
                            <Checkbox key={undertema.id} value={undertema.id}>
                                {undertema.navn}
                            </Checkbox>
                            {undertema.planlagt ? (
                                <StartOgSluttVelger
                                    undertema={undertema}
                                    setNyStartDato={(date) =>
                                        setNyStartDato(undertema.id, date)
                                    }
                                    setNySluttDato={(date) =>
                                        setNySluttDato(undertema.id, date)
                                    }
                                />
                            ) : undefined}
                        </UndertemaRad>
                    );
                })}
        </CheckboxGroup>
    );
}
