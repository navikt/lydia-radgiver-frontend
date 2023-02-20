import { useState } from "react";
import { Button, Select, UNSAFE_DatePicker, UNSAFE_useDatepicker } from "@navikt/ds-react";
import {
    nyLeveransePåSak,
    useHentIASakLeveranser,
    useHentIATjenesteModuler,
    useHentIATjenester
} from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { IASakLeveranse, IATjenesteModul } from "../../../domenetyper/iaLeveranse";

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
    const {
        data: iaSakLeveranserPerTjeneste
    } = useHentIASakLeveranser(iaSak.orgnr, iaSak.saksnummer);

    const {
        data: iaTjenester,
        loading: lasterIATjenester
    } = useHentIATjenester();
    const {
        data: moduler,
        loading: lasterIATjenesteModuler
    } = useHentIATjenesteModuler();
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

    const erModulIkkeValgt = (modul : IATjenesteModul) : boolean => {
        if (!iaSakLeveranserPerTjeneste || iaSakLeveranserPerTjeneste.length === 0) {
            return true;
        }

        return iaSakLeveranserPerTjeneste
            .flatMap(tjenesteMedValgteLeveranser => tjenesteMedValgteLeveranser.leveranser)
            .every((leveranse : IASakLeveranse) => leveranse.modul.id !== modul.id)
    }

    return (
        <Form onSubmit={(e) => e.preventDefault()}>
            <Select label="Velg IA-tjeneste" value={valgtIATjeneste} onChange={endreValgtIATjeneste}>
                <option value="">{lasterIATjenester && "Laster IA-tjenester..."}</option>
                {iaTjenester?.map((tjeneste) =>
                    <option value={tjeneste.id} key={tjeneste.id}>{tjeneste.navn}</option>
                )}
            </Select>
            <Select label="Velg modul" value={valgtModul} onChange={endreValgtModul}>
                <option value="">{lasterIATjenesteModuler && "Laster moduler..."}</option>
                {moduler?.filter((modul) => modul.iaTjeneste.toString() === valgtIATjeneste)
                    .filter((modul) => erModulIkkeValgt(modul))
                    .map((modul) =>
                        <option value={modul.id} key={modul.id}>{modul.navn}</option>
                    )}
            </Select>
            <UNSAFE_DatePicker {...datepickerProps}>
                <UNSAFE_DatePicker.Input {...inputProps} label="Tentativ frist" />
            </UNSAFE_DatePicker>
            <Button onClick={leggTilLeveranse}>Legg til</Button>
        </Form>
    )
}