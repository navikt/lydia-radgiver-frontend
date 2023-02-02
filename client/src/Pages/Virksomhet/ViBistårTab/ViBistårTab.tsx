import { Button, Select, UNSAFE_DatePicker, UNSAFE_useDatepicker } from "@navikt/ds-react";
import { IATjenesteModuler, IATjenester } from "../mocks/iaSakLeveranseMock";
import { useState } from "react";

export const ViBistårTab = () => {
    const iaTjenester = IATjenester;
    const moduler = IATjenesteModuler;
    const [valgtIATjeneste, setValgtIATjeneste] = useState("");
    const [valgtModul, setValgtModul] = useState("");


    const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
        fromDate: new Date("Aug 23 2019"),
        onDateChange: console.log,
    });

    const endreValgtIATjeneste = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValgtModul("");
        setValgtIATjeneste(e.target.value);
    }
    const endreValgtModul = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValgtModul(e.target.value);
    }

    return (
        <div>
            <Select label="Velg IA-tjeneste" value={valgtIATjeneste} onChange={endreValgtIATjeneste}>
                <option value=""></option>
                {iaTjenester.map((tjeneste) =>
                    <option value={tjeneste.id} key={tjeneste.id}>{tjeneste.navn}</option>
                )}
            </Select>
            <Select label="Velg modul" value={valgtModul} onChange={endreValgtModul}>
                <option value=""></option>
                {moduler.filter((modul) => modul.iaTjeneste.toString() === valgtIATjeneste)
                    .map((modul) =>
                        <option value={modul.id} key={modul.id}>{modul.navn}</option>
                    )}
            </Select>
            <UNSAFE_DatePicker {...datepickerProps}>
                <UNSAFE_DatePicker.Input {...inputProps} label="Velg dato" />
            </UNSAFE_DatePicker>
            <Button>Legg til</Button>

            {/* TODO fjern preview for testing */}
            <p>Preview av state</p>
            <p>IA-tjeneste: {valgtIATjeneste as unknown as number ? IATjenester[valgtIATjeneste as unknown as number -1].navn : ("ikke valgt") }</p>
            <p>Modul: {valgtModul as unknown as number ? IATjenesteModuler[valgtModul as unknown as number -1].navn : ("ikke valgt")}</p>
        </div>
    )
}
