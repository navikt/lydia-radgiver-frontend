import { useState } from "react";
import { Button, Select, UNSAFE_DatePicker, UNSAFE_useDatepicker } from "@navikt/ds-react";
import { IATjenesteModuler, IATjenester } from "../mocks/iaSakLeveranseMock";
import { nyLeveransePåSak, useHentIASakLeveranser } from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2rem;
  row-gap: 1rem;
  align-items: end;
  
  div {
    min-width: 8rem;
  }
`;

interface Props {
    iaSak: IASak;
}

export const NyIALeveranseSkjema = ({ iaSak }: Props) => {
    const iaTjenester = IATjenester;
    const moduler = IATjenesteModuler;
    const [valgtIATjeneste, setValgtIATjeneste] = useState("");
    const [valgtModul, setValgtModul] = useState("");
    const { mutate: hentLeveranserPåNytt } = useHentIASakLeveranser(iaSak.orgnr, iaSak.saksnummer)


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
        if (valgtModul === "" || !selectedDay) {
            return;
        }
        nyLeveransePåSak(iaSak.orgnr, iaSak.saksnummer, Number(valgtModul), selectedDay)
            .then(() => hentLeveranserPåNytt())
    }

    return (
        <Form onSubmit={(e) => e.preventDefault()}>
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
        </Form>
    )
}