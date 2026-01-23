import {
    Checkbox,
    CheckboxGroup,
    DatePicker,
    HStack,
    useDatepicker,
} from "@navikt/ds-react";
import { RedigertInnholdMal } from "../../../domenetyper/plan";
import {
    FIRST_VALID_DATE,
    LAST_VALID_DATE,
    defaultEndDate,
    defaultStartDate,
} from "./planconster";
import styles from "./plan.module.scss";

function StartOgSluttVelger({
    redigertInnholdMal,
    setNyStartDato,
    setNySluttDato,
    setNyStartOgSluttDato,
}: {
    redigertInnholdMal: RedigertInnholdMal;
    setNyStartDato: (date: Date) => void;
    setNySluttDato: (date: Date) => void;
    setNyStartOgSluttDato: (startDato: Date, sluttDato: Date) => void;
}) {
    const datepickerFrom = useDatepicker({
        defaultSelected: redigertInnholdMal.startDato ?? undefined,
        required: true,
        fromDate: new Date(FIRST_VALID_DATE),
        toDate: new Date(LAST_VALID_DATE),
        onDateChange: (date) => {
            if (date) {
                if (
                    redigertInnholdMal.sluttDato === null ||
                    date > redigertInnholdMal.sluttDato
                ) {
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
        defaultSelected: redigertInnholdMal.sluttDato ?? undefined,
        required: true,
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
    temaNavn,
}: {
    valgteUndertemaer: RedigertInnholdMal[];
    velgUndertemaer: (val: RedigertInnholdMal[]) => void;
    setVisInnholdFeil: (val: boolean) => void;
    visInnholdFeil: boolean;
    temaNavn: string;
}) {
    const planleggUndertema = (undertemaIder: number[]) => {
        velgUndertemaer(
            valgteUndertemaer.map((redigertInnholdMal) =>
                undertemaIder.includes(redigertInnholdMal.rekkefølge)
                    ? {
                          ...redigertInnholdMal,
                          inkludert: true,
                          startDato:
                              redigertInnholdMal.startDato ?? defaultStartDate,
                          sluttDato:
                              redigertInnholdMal.sluttDato ?? defaultEndDate,
                      }
                    : {
                          ...redigertInnholdMal,
                          inkludert: false,
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

    const setNyStartOgSluttDato = (
        rekkefølge: number,
        startDato: Date,
        sluttDato: Date,
    ) => {
        velgUndertemaer(
            valgteUndertemaer.map((innhold) =>
                innhold.rekkefølge === rekkefølge
                    ? { ...innhold, sluttDato, startDato }
                    : { ...innhold },
            ),
        );
    };

    return (
        <CheckboxGroup
            className={styles.undertemaCheckboxGroup}
            legend={temaNavn}
            value={valgteUndertemaer
                .filter((undertema) => undertema.inkludert)
                .map((undertema) => undertema.rekkefølge)}
            error={
                visInnholdFeil
                    ? "Du må velge noe innhold for å opprette en samarbeidsplan"
                    : null
            }
            onChange={(val: number[]) => {
                planleggUndertema(val);
                setVisInnholdFeil(false);
            }}
        >
            {valgteUndertemaer.map((redigertInnholdMal) => {
                return (
                    <HStack
                        key={`${redigertInnholdMal.rekkefølge}${redigertInnholdMal.sluttDato}${redigertInnholdMal.startDato}`}
                        className={styles.undertemaRad}
                        justify="space-between"
                        gap="4"
                        align="center"
                    >
                        <Checkbox value={redigertInnholdMal.rekkefølge}>
                            {redigertInnholdMal.navn}
                        </Checkbox>
                        {redigertInnholdMal.inkludert ? (
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
                                setNyStartOgSluttDato={(startDato, sluttDato) =>
                                    setNyStartOgSluttDato(
                                        redigertInnholdMal.rekkefølge,
                                        startDato,
                                        sluttDato,
                                    )
                                }
                            />
                        ) : undefined}
                    </HStack>
                );
            })}
        </CheckboxGroup>
    );
}
