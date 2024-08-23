import { Checkbox, CheckboxGroup, HStack, MonthPicker } from "@navikt/ds-react";
import styled from "styled-components";
import { PlanUndertema } from "../../../domenetyper/plan";
import React from "react";

const UndertemaRad = styled(HStack)`
    margin-bottom: 0.5rem;
    min-width: 48rem;
`;

function StartOgSluttVelger({
    undertema,
    setNyStartDato,
    setNySluttDato,
}: {
    undertema: PlanUndertema;
    setNyStartDato: (date: Date) => void;
    setNySluttDato: (date: Date) => void;
}) {
    const lagreStartDato = (date: Date | undefined) => {
        if (date === undefined) {
            console.log("dato ikke valgt");
        } else {
            setNyStartDato(date);
        }
    };
    const lagreSluttDato = (date: Date | undefined) => {
        if (date === undefined) {
            console.log("dato ikke valgt");
        } else {
            setNySluttDato(date);
        }
    };

    return (
        <HStack align="center" gap="3">
            <MonthPicker onMonthSelect={lagreStartDato}>
                <MonthPicker.Input
                    hideLabel
                    size="small"
                    label={`Startdato for ${undertema.navn}`}
                    value={
                        undertema?.startDato === null
                            ? ""
                            : `${undertema.startDato.toLocaleString("default", { month: "short" })} ${undertema.startDato.getFullYear()}`
                    }
                    onChange={(date) => console.log(date)}
                />
            </MonthPicker>
            {" - "}
            <MonthPicker
                selected={undertema.sluttDato ?? new Date()}
                defaultSelected={undertema.sluttDato ?? new Date()}
                onMonthSelect={lagreSluttDato}
            >
                <MonthPicker.Input
                    hideLabel
                    size="small"
                    label={`Sluttdato for ${undertema.navn}`}
                    value={
                        undertema.sluttDato === null
                            ? ""
                            : `${undertema.sluttDato.toLocaleString("default", { month: "short" })} ${undertema.sluttDato.getFullYear()}`
                    }
                    onChange={(date) => console.log(date)}
                />
            </MonthPicker>
        </HStack>
    );
}

interface UndertemaSetupProps {
    valgteUndertemaer: PlanUndertema[];
    velgUndertemaer: (val: PlanUndertema[]) => void;
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
            {valgteUndertemaer.map((undertema) => {
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
