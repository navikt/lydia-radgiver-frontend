import { useEffect, useState } from "react";
import {
    UNSAFE_MonthPicker, UNSAFE_useMonthpicker,
} from "@navikt/ds-react";
import { FraTilFieldset } from "./FraTilFieldset";
import { Periode } from "../../../domenetyper/domenetyper";

interface PeriodeVelgerProps {
    erSynlig: boolean;
    endrePeriode: (value: Periode) => void;
    fraDato?: Date | undefined;
    tilDato?: Date | undefined;
}

const nav_red = 'rgb(195, 0, 0)';

export const PeriodeVelger = ({erSynlig, endrePeriode, fraDato, tilDato}:
                                  PeriodeVelgerProps) => {

    const [forTidlig, setForTidlig] = useState<boolean>();
    const [ugyldigFraDato, setUgyldigFraDato] = useState<boolean>();
    const [ugyldigTilDato, setUgyldigTilDato] = useState<boolean>();

    const [nyFraDato, setNyFraDato] = useState<Date | undefined>(fraDato);
    const [nyTilDato, setNyTilDato] = useState<Date | undefined>(tilDato);

    const {
        monthpickerProps: monthpickerFraProps,
        inputProps: inputFraProps,
    } = UNSAFE_useMonthpicker(
        {
            defaultSelected: nyFraDato,
            onMonthChange: (dato) => {
                setNyFraDato(dato);
            },
            onValidate: (måned) => {
                if (måned.isEmpty) {
                    setUgyldigFraDato(false);
                } else {
                    if (!måned.isValidMonth) setUgyldigFraDato(true);
                    else setUgyldigFraDato(false);
                }
            }
        }
    );

    const {
        monthpickerProps: monthpickerTilProps,
        inputProps: inputTilProps,
    } = UNSAFE_useMonthpicker(
        {
            defaultSelected: nyTilDato,
            onMonthChange: (dato) => {
                setNyTilDato(dato);
            },
            onValidate: (måned) => {
                if (måned.isEmpty) {
                    setUgyldigTilDato(false);
                } else {
                    if (!måned.isValidMonth) setUgyldigTilDato(true);
                    else setUgyldigTilDato(false);
                }
            },

        }
    );

    useEffect(() => {
        if (nyFraDato && nyTilDato) {
            if (nyFraDato.getTime() > nyTilDato.getTime()) {
                setForTidlig(true);
            } else {
                setForTidlig(false);
            }
            endrePeriode({fraDato: nyFraDato, tilDato: nyTilDato});
        }
    }, [nyFraDato, nyTilDato]);

    if (!erSynlig) return null;

    return (
        <div>
            <FraTilFieldset legend={"Periode"}>
                <UNSAFE_MonthPicker
                    {...monthpickerFraProps}
                >
                    <UNSAFE_MonthPicker.Input
                        style={{marginBottom: 10}}
                        {...inputFraProps}
                        label="Fra"
                        error={ugyldigFraDato || forTidlig}
                    />
                </UNSAFE_MonthPicker>
                <UNSAFE_MonthPicker
                    {...monthpickerTilProps}
                >
                    <UNSAFE_MonthPicker.Input
                        style={{marginBottom: 10}}
                        {...inputTilProps}
                        label="Til"
                        error={ugyldigFraDato || forTidlig}
                    />
                </UNSAFE_MonthPicker>
            </FraTilFieldset>
            <div>

                {(ugyldigFraDato || ugyldigTilDato) &&
                    <p style={{color: nav_red}}>Dette er ikke en gyldig dato. Gyldig format er mmm ÅÅÅÅ </p>}
                {!(ugyldigFraDato || ugyldigTilDato) && forTidlig &&
                    <p style={{color: nav_red}}>Fra dato må være før til dato</p>}
            </div>

        </div>
    );
};
