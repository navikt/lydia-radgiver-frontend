import { Button, Select, UNSAFE_DatePicker, UNSAFE_useDatepicker } from "@navikt/ds-react";
import { IATjenesteModuler, IATjenester } from "../mocks/iaSakLeveranseMock";
import { useState } from "react";
import { lokalDato } from "../../../util/dato";
import { nyLeveransePåSak } from "../../../api/lydia-api";

interface Props {
    saksnummer?: string;
}

export const ViBistårTab = ({saksnummer}: Props) => {
    if (!saksnummer) return <p>Klarte ikke å hente saksnummer</p>

    const iaTjenester = IATjenester;
    const moduler = IATjenesteModuler;
    const [valgtIATjeneste, setValgtIATjeneste] = useState("");
    const [valgtModul, setValgtModul] = useState("");


    const { datepickerProps, inputProps, selectedDay } = UNSAFE_useDatepicker({
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

    const leggTilLeveranse = () => {
        alert(` Data ved "Legg til"
        IATjeneste: ${IATjenester[Number(valgtIATjeneste) - 1].navn}
        modul: ${IATjenesteModuler[Number(valgtModul) - 1].navn}
        frist: ${ selectedDay ? lokalDato(selectedDay) : "ikke valgt"}            
        `)

        if(!saksnummer || valgtModul === "" || !selectedDay ) {
            return;
        }

        nyLeveransePåSak(saksnummer, Number(valgtModul), selectedDay)
    }

    return (
        <form onSubmit={(e) => e.preventDefault()}>
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
            <Button onClick={leggTilLeveranse}>Legg til</Button>
        </form>
    )
}
