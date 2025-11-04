import {
    CheckboxGroup,
    HStack,
    DatePicker,
    useDatepicker,
} from "@navikt/ds-react";
import { PlanInnhold } from "../../../domenetyper/plan";
import React from "react";
import {
    FIRST_VALID_DATE,
    LAST_VALID_DATE,
    defaultEndDate,
    defaultStartDate,
} from "./planconster";
import { loggEndringAvPlan } from "../../../util/analytics-klient";
import LåsbarCheckbox from "../../../components/LåsbarCheckbox";
import styles from './plan.module.scss';

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
            .filter((innhold) => innhold.inkludert)
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
            const innholdNavn = valgteInnhold.find(
                (innhold) => innhold.id === innholdId,
            )?.navn;
            if (innholdNavn !== null && innholdNavn !== undefined) {
                loggEndringAvPlan(temaNavn, innholdNavn, "valgt");
            }
        }

        for (const innholdId of fjernet) {
            const innholdNavn = valgteInnhold.find(
                (innhold) => innhold.id === innholdId,
            )?.navn;
            if (innholdNavn !== null && innholdNavn !== undefined) {
                loggEndringAvPlan(temaNavn, innholdNavn, "fjernet");
            }
        }

        velgInnhold(
            valgteInnhold.map((innhold) =>
                innholdIder.includes(innhold.id)
                    ? {
                        ...innhold,
                        inkludert: true,
                        status: "PLANLAGT",
                        startDato: innhold.startDato ?? defaultStartDate,
                        sluttDato: innhold.sluttDato ?? defaultEndDate,
                    }
                    : {
                        ...innhold,
                        inkludert: false,
                        startDato: null,
                        sluttDato: null,
                        status: null,
                    },
            ),
        );
    };

    const setNyStartDato = (innholdId: number, date: Date) => {
        const innholdNavn = valgteInnhold.find(
            (innhold) => innhold.id === innholdId,
        )?.navn;
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
        const innholdNavn = valgteInnhold.find(
            (innhold) => innhold.id === innholdId,
        )?.navn;
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

    const setNyStartOgSluttDato = (innholdId: number, startDato: Date, sluttDato: Date) => {
        const innholdNavn = valgteInnhold.find(
            (innhold) => innhold.id === innholdId,
        )?.navn;
        if (innholdNavn) {
            loggEndringAvPlan(temaNavn, innholdNavn, "til");
        }
        velgInnhold(
            valgteInnhold.map((innhold) =>
                innhold.id === innholdId
                    ? { ...innhold, sluttDato, startDato }
                    : { ...innhold },
            ),
        );
    };

    return (
        <CheckboxGroup
            className={styles.innholdsoppsetCheckboxGroup}
            legend={temaNavn}
            value={valgteIder}
            onChange={planleggInnhold}
        >
            {valgteInnhold
                .sort((a, b) => {
                    return a.id - b.id;
                })
                .map((innhold) => (
                    <Undertemarad
                        key={innhold.id}
                        innhold={innhold}
                        setNyStartDato={setNyStartDato}
                        setNySluttDato={setNySluttDato}
                        setNyStartOgSluttDato={setNyStartOgSluttDato}
                    />
                ))}
        </CheckboxGroup>
    );
}

function Undertemarad({
    innhold,
    setNyStartDato,
    setNySluttDato,
    setNyStartOgSluttDato,
}: {
    innhold: PlanInnhold;
    setNyStartDato: (innholdId: number, date: Date) => void;
    setNySluttDato: (innholdId: number, date: Date) => void;
    setNyStartOgSluttDato: (innholdId: number, startDato: Date, sluttDato: Date) => void;
}) {
    return (
        <HStack
            key={`${innhold.sluttDato}${innhold.startDato}${innhold.id}`}
            className={styles.innholdsrad}
            justify="space-between"
            gap="4"
            align="center"
        >
            <RadCheckbox innhold={innhold} låst={innhold.harAktiviteterISalesforce && innhold.inkludert} />
            {innhold.inkludert ? (
                <StartOgSluttVelger
                    innhold={innhold}
                    setNyStartDato={(date) =>
                        setNyStartDato(innhold.id, date)
                    }
                    setNySluttDato={(date) =>
                        setNySluttDato(innhold.id, date)
                    }
                    setNyStartOgSluttDato={(startDato, sluttDato) =>
                        setNyStartOgSluttDato(innhold.id, startDato, sluttDato)
                    }
                />
            ) : undefined}
        </HStack>
    );
}

function RadCheckbox({
    innhold,
    låst,
}: {
    innhold: PlanInnhold;
    låst: boolean;
}) {
    return (
        <LåsbarCheckbox
            låst={låst}
            value={innhold.id}
            tooltipText="Rad er låst fordi det er aktiviteter i Salesforce"
        >
            {innhold.navn}
        </LåsbarCheckbox>
    );
}


function StartOgSluttVelger({
    innhold,
    setNyStartDato,
    setNySluttDato,
    setNyStartOgSluttDato,
}: {
    innhold: PlanInnhold;
    setNyStartDato: (date: Date) => void;
    setNySluttDato: (date: Date) => void;
    setNyStartOgSluttDato: (startDato: Date, sluttDato: Date) => void;
    låst?: boolean;
}) {
    const datepickerFrom = useDatepicker({
        defaultSelected: innhold.startDato ?? undefined,
        required: true,
        fromDate: new Date(FIRST_VALID_DATE),
        toDate: new Date(LAST_VALID_DATE),
        onDateChange: (date) => {
            if (date) {
                if (innhold.sluttDato && date > innhold.sluttDato) {
                    const nySluttdato = new Date(date);
                    nySluttdato.setMonth(nySluttdato.getMonth() + 1);

                    setNyStartOgSluttDato(date, nySluttdato);
                } else {
                    setNyStartDato(date);
                }

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
        <HStack wrap gap="4" justify="center">
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
        </HStack>
    );
}