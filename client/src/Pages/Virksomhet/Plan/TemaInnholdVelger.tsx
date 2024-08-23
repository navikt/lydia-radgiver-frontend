import { Checkbox, CheckboxGroup, HStack, MonthPicker } from "@navikt/ds-react";
import styled from "styled-components";
import { RedigertInnholdMal } from "../../../domenetyper/plan";
import React from "react";
import * as console from "node:console";

const UndertemaRad = styled(HStack)`
    margin-bottom: 0.5rem;
    min-width: 48rem;
`;

function StartOgSluttVelger({
    redigertInnholdMal,
    setNyStartDato,
    setNySluttDato,
}: {
    redigertInnholdMal: RedigertInnholdMal;
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
                    label={`Startdato for ${redigertInnholdMal.navn}`}
                    value={
                        redigertInnholdMal?.startDato === null
                            ? ""
                            : `${redigertInnholdMal.startDato.toLocaleString("default", { month: "short" })} ${redigertInnholdMal.startDato.getFullYear()}`
                    }
                    onChange={(date) => console.log(date)}
                />
            </MonthPicker>
            {" - "}
            <MonthPicker
                selected={redigertInnholdMal.sluttDato ?? new Date()}
                defaultSelected={redigertInnholdMal.sluttDato ?? new Date()}
                onMonthSelect={lagreSluttDato}
            >
                <MonthPicker.Input
                    hideLabel
                    size="small"
                    label={`Sluttdato for ${redigertInnholdMal.navn}`}
                    value={
                        redigertInnholdMal.sluttDato === null
                            ? ""
                            : `${redigertInnholdMal.sluttDato.toLocaleString("default", { month: "short" })} ${redigertInnholdMal.sluttDato.getFullYear()}`
                    }
                    onChange={(date) => console.log(date)}
                />
            </MonthPicker>
        </HStack>
    );
}

interface UndertemaSetupProps {
    valgteUndertemaer: RedigertInnholdMal[];
    velgUndertemaer: (val: RedigertInnholdMal[]) => void;
}

export default function TemaInnholdVelger({
    valgteUndertemaer,
    velgUndertemaer,
}: UndertemaSetupProps) {
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
            onChange={planleggUndertema}
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
