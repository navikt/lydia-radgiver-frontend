import { useState } from "react";
import { BodyShort, Button, DatePicker, Heading, Select, useDatepicker } from "@navikt/ds-react";
import {
    nyLeveransePåSak,
    useHentAktivSakForVirksomhet,
    useHentBrukerinformasjon,
    useHentIATjenester,
    useHentLeveranser,
    useHentModuler
} from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { IATjeneste, LeveranserPerIATjeneste } from "../../../domenetyper/leveranse";
import { RolleEnum } from "../../../domenetyper/brukerinformasjon";
import { loggLeveranseFristKategori } from "../../../util/amplitude-klient";
import { finnAktivModulFraIATjeneste } from "./finnAktivModulFraIATjeneste";

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2rem;
  row-gap: 1rem;
  align-items: start;

  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  div {
    min-width: 8rem;
  }
`;

const LeggTilKnapp = styled(Button)`
  margin-top: 2rem;
`;

interface Props {
    iaSak: IASak;
    leveranserPerIATjeneste?: LeveranserPerIATjeneste[];
}

export const LeggTilLeveranse = ({ iaSak, leveranserPerIATjeneste }: Props) => {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;
    const brukerMedLesetilgang = brukerInformasjon?.rolle === RolleEnum.enum.Lesetilgang;

    if (brukerMedLesetilgang) {
        return null;
    }

    const [ugyldigDate, setUgyldigDate] = useState<boolean>();

    const {
        data: iaTjenester,
        loading: lasterIATjenester
    } = useHentIATjenester();
    const {
        data: moduler,
    } = useHentModuler();
    const [valgtIATjeneste, setValgtIATjeneste] = useState("");
    const [feiletForsøk, setFeiletForsøk] = useState(false);
    const ugyldigIATjeneste = valgtIATjeneste === "" || valgtIATjeneste === undefined || valgtIATjeneste === null;
    const { mutate: hentLeveranserPåNytt } = useHentLeveranser(iaSak.orgnr, iaSak.saksnummer)
    const { mutate: hentSakPåNytt } = useHentAktivSakForVirksomhet(iaSak.orgnr)



    const { datepickerProps, inputProps, selectedDay } = useDatepicker({
        onValidate: (val) => {
            if (val.isEmpty) {
                setUgyldigDate(false);
            } else {
                if (val.isWeekend === undefined) setUgyldigDate(true);
                else setUgyldigDate(false);
            }
        },
    });

    const endreValgtIATjeneste = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValgtIATjeneste(e.target.value);
    }

    const leggTilLeveranse = () => {
        if (valgtIATjeneste === "" || !selectedDay || !moduler) {
            setFeiletForsøk(true);
            return;
        }

        const modul = finnAktivModulFraIATjeneste(valgtIATjeneste, moduler)

        if (!modul) {
            return;
        }
        nyLeveransePåSak(iaSak.orgnr, iaSak.saksnummer, modul.id, selectedDay)
            .then(() => {
                hentLeveranserPåNytt()
                hentSakPåNytt()
                setFeiletForsøk(false);
                setValgtIATjeneste("");
            })
        loggLeveranseFristKategori(selectedDay)
    }

    const filterBrukteIATjenester = (tjeneste: IATjeneste) => {
        if (moduler) {
            const modul = finnAktivModulFraIATjeneste(`${tjeneste.id}`, moduler);

            for (let leveranseIndex = 0; leveranserPerIATjeneste && leveranseIndex < leveranserPerIATjeneste.length; leveranseIndex++) {
                const leveranse = leveranserPerIATjeneste[leveranseIndex];

                for (let index = 0; index < leveranse.leveranser.length; index++) {
                    const leveransemodul = leveranse.leveranser[index].modul;

                    if (leveransemodul.id === modul?.id) {
                        return false;
                    }
                }
            }

            return true;
        }

        return false;
    };

    return (
        <div>
            <Heading level="4" size="small">Legg til ny IA-tjeneste</Heading>
            {!brukerErEierAvSak &&
                <BodyShort spacing={true}>Du må være eier av saken for å kunne legge til IA-tjenester</BodyShort>
            }

            <Form onSubmit={(e) => e.preventDefault()}>
                <Select label="IA-tjeneste"
                    value={valgtIATjeneste}
                    onChange={endreValgtIATjeneste}
                    error={ugyldigIATjeneste && feiletForsøk ? "Du må velge en IA-tjeneste" : undefined}
                >
                    <option value="">{lasterIATjenester && "Laster IA-tjenester..."}</option>
                    {iaTjenester?.sort(iatjenesterStigendeEtterId).filter(filterBrukteIATjenester).map((tjeneste) =>
                        <option value={tjeneste.id} key={tjeneste.id}>{tjeneste.navn}</option>
                    )}
                </Select>
                <DatePicker {...datepickerProps}>
                    <DatePicker.Input {...inputProps}
                        label="Tentativ frist"
                        error={
                            (ugyldigDate &&
                                <>Dette er ikke en gyldig dato.<br />Gyldig format er DD.MM.ÅÅÅÅ</>) || (
                                (!selectedDay && feiletForsøk && "Du må velge en dato")
                            )
                        }
                        disabled={!brukerErEierAvSak}
                    />

                </DatePicker>
                {brukerErEierAvSak &&
                    <LeggTilKnapp onClick={leggTilLeveranse}>Legg til</LeggTilKnapp>
                }
            </Form>
        </div>
    )
}

const iatjenesterStigendeEtterId = (a: IATjeneste, b: IATjeneste) => {
    return a.id - b.id;
}
