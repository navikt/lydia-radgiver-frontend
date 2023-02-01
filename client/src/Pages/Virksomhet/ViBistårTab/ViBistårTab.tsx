import { Button, Select, UNSAFE_DatePicker, UNSAFE_useDatepicker } from "@navikt/ds-react";

export const ViBistårTab = () => {

    const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
        fromDate: new Date("Aug 23 2019"),
        onDateChange: console.log,
    });

    return (
        <div>
            <Select label="Velg IA-tjeneste">
                <option value="">Velg IA-tjeneste</option>
            </Select>
            <Select label="Velg modul">
                <option value="">Velg modul</option>
            </Select>
            <UNSAFE_DatePicker {...datepickerProps}>
                <UNSAFE_DatePicker.Input {...inputProps} label="Velg dato" />
            </UNSAFE_DatePicker>
            <Button>Legg til</Button>
        </div>
    )

}
