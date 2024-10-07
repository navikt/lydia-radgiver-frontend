import {
    Checkbox,
    CheckboxGroup,
    HStack,
    DatePicker,
    useDatepicker,
} from "@navikt/ds-react";
import styled from "styled-components";
import { PlanInnhold } from "../../../domenetyper/plan";
import React from "react";
import { FIRST_VALID_DATE, LAST_VALID_DATE, defaultEndDate, defaultStartDate } from "./planconster";
import { loggEndringAvPlan } from "../../../util/amplitude-klient";

const InnholdsRad = styled(HStack)`
    margin-bottom: 0.5rem;
    min-width: 48rem;
`;

// Noe ødelegger --a-spacing-6 så vi setter det manuelt. Bør ta en titt og finne ut hva som ødelegger det senere.
const StyledHStack = styled(HStack)`
    --a-spacing-6: 1.5rem;
`;


function StartOgSluttVelger({
    innhold,
    setNyStartDato,
    setNySluttDato,
}: {
    innhold: PlanInnhold;
    setNyStartDato: (date: Date) => void;
    setNySluttDato: (date: Date) => void;
}) {
    const datepickerFrom = useDatepicker({
        defaultSelected: innhold.startDato ?? undefined,
        required: true,
        fromDate: new Date(FIRST_VALID_DATE),
        toDate: new Date(innhold.sluttDato ?? LAST_VALID_DATE),
        onDateChange: (date) => {
            if (date) {
                setNyStartDato(date);
            }
        },
    });
    const datepickerTo = useDatepicker({
        defaultSelected: innhold.sluttDato ?? undefined,
        required: true,
        fromDate: new Date(innhold.startDato ?? FIRST_VALID_DATE),
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
                    label={`Startdato for ${innhold.navn}`}
                    {...datepickerFrom.inputProps}
                />
            </DatePicker>
            <DatePicker {...datepickerTo.datepickerProps} dropdownCaption>
                <DatePicker.Input
                    hideLabel
                    size="small"
                    label={`Sluttdato for ${innhold.navn}`}
                    {...datepickerTo.inputProps}
                />
            </DatePicker>
        </StyledHStack>
    );
}

export default function InnholdOppsett({
    valgteInnhold,
    velgInnhold,
    temaNavn,
}: {
    valgteInnhold: PlanInnhold[];
    velgInnhold: (val: PlanInnhold[]) => void;
    temaNavn: string;
}) {
    const valgteIder = React.useMemo(() => {
        return valgteInnhold
            .filter((innhold) => innhold.planlagt)
            .map((innhold) => innhold.id);
    }, [valgteInnhold]);

    const planleggInnhold = (innholdIder: number[]) => {
        const lagtTil = innholdIder.filter(
            (innholdId) => !valgteIder.includes(innholdId),
        );
        const fjernet = valgteIder.filter(
            (innholdId) => !innholdIder.includes(innholdId),
        );

        for (const innholdId of lagtTil) {
            const innholdNavn = valgteInnhold.find((innhold) => innhold.id === innholdId)?.navn;
            if (innholdNavn !== null && innholdNavn !== undefined) {
                loggEndringAvPlan(temaNavn, innholdNavn, "valgt");
            }
        }

        for (const innholdId of fjernet) {
            const innholdNavn = valgteInnhold.find((innhold) => innhold.id === innholdId)?.navn;
            if (innholdNavn !== null && innholdNavn !== undefined) {
                loggEndringAvPlan(temaNavn, innholdNavn, "fjernet");
            }
        }


        velgInnhold(
            valgteInnhold.map((innhold) =>
                innholdIder.includes(innhold.id)
                    ? {
                        ...innhold,
                        planlagt: true,
                        status: "PLANLAGT",
                        startDato: innhold.startDato ?? defaultStartDate,
                        sluttDato: innhold.sluttDato ?? defaultEndDate,
                    }
                    : {
                        ...innhold,
                        planlagt: false,
                        startDato: null,
                        sluttDato: null,
                        status: null,
                    },
            ),
        );
    };

    const setNyStartDato = (innholdId: number, date: Date) => {
        const innholdNavn = valgteInnhold.find((innhold) => innhold.id === innholdId)?.navn;
        if (innholdNavn) {
            loggEndringAvPlan(temaNavn, innholdNavn, "fra");
        }
        velgInnhold(
            valgteInnhold.map((innhold) =>
                innhold.id === innholdId
                    ? { ...innhold, startDato: date }
                    : { ...innhold },
            ),
        );
    };

    const setNySluttDato = (innholdId: number, date: Date) => {
        const innholdNavn = valgteInnhold.find((innhold) => innhold.id === innholdId)?.navn;
        if (innholdNavn) {
            loggEndringAvPlan(temaNavn, innholdNavn, "til");
        }
        velgInnhold(
            valgteInnhold.map((innhold) =>
                innhold.id === innholdId
                    ? { ...innhold, sluttDato: date }
                    : { ...innhold },
            ),
        );
    };

    return (
        <CheckboxGroup
            legend={"Velg innhold og varighet"}
            value={valgteInnhold
                .filter((innhold) => innhold.planlagt)
                .map((innhold) => innhold.id)}
            onChange={planleggInnhold}
        >
            {valgteInnhold
                .sort((a, b) => {
                    return a.id - b.id;
                })
                .map((innhold) => {
                    return (
                        <InnholdsRad
                            key={`${innhold.sluttDato}${innhold.startDato}${innhold.id}`}
                            justify="space-between"
                            gap="4"
                            align="center"
                        >
                            <Checkbox value={innhold.id}>
                                {innhold.navn}
                            </Checkbox>
                            {innhold.planlagt ? (
                                <StartOgSluttVelger
                                    innhold={innhold}
                                    setNyStartDato={(date) =>
                                        setNyStartDato(innhold.id, date)
                                    }
                                    setNySluttDato={(date) =>
                                        setNySluttDato(innhold.id, date)
                                    }
                                />
                            ) : undefined}
                        </InnholdsRad>
                    );
                })}
        </CheckboxGroup>
    );
}
