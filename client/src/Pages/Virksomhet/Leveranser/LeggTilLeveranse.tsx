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
import { IATjeneste } from "../../../domenetyper/leveranse";
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
}

export const LeggTilLeveranse = ({ iaSak }: Props) => {
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerErEierAvSak = iaSak.eidAv === brukerInformasjon?.ident;
    const brukerMedLesetilgang = brukerInformasjon?.rolle === RolleEnum.enum.Lesetilgang;

    if (brukerMedLesetilgang) {
        return null;
    }

    const [forTidlig, setForTidlig] = useState<boolean>();
    const [ugyldig, setUgyldig] = useState<boolean>();

    const {
        data: iaTjenester,
        loading: lasterIATjenester
    } = useHentIATjenester();
    const {
        data: moduler,
    } = useHentModuler();
    const [valgtIATjeneste, setValgtIATjeneste] = useState("");
    const { mutate: hentLeveranserPåNytt } = useHentLeveranser(iaSak.orgnr, iaSak.saksnummer)
    const { mutate: hentSakPåNytt } = useHentAktivSakForVirksomhet(iaSak.orgnr)


    const { datepickerProps, inputProps, selectedDay } = useDatepicker({
        onValidate: (val) => {
            if (val.isBefore) setForTidlig(true);
            else setForTidlig(false);
            if (val.isEmpty) {
                setUgyldig(false);
            } else {
                if (val.isWeekend === undefined) setUgyldig(true);
                else setUgyldig(false);
            }
        },
    });

    const endreValgtIATjeneste = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValgtIATjeneste(e.target.value);
    }

    const leggTilLeveranse = () => {
        if (valgtIATjeneste === "" || !selectedDay || !moduler) {
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
            })
        loggLeveranseFristKategori(selectedDay)
    }

    return (
        <div>
            <Heading size="small">Legg til ny IA-tjeneste</Heading>
            {!brukerErEierAvSak &&
                <BodyShort spacing={true}>Du må være eier av saken for å kunne legge til IA-tjenester</BodyShort>
            }

            <Form onSubmit={(e) => e.preventDefault()}>
                <Select label="IA-tjeneste"
                        value={valgtIATjeneste}
                        onChange={endreValgtIATjeneste}
                        disabled={!brukerErEierAvSak}
                >
                    <option value="">{lasterIATjenester && "Laster IA-tjenester..."}</option>
                    {iaTjenester?.sort(iatjenesterStigendeEtterId).map((tjeneste) =>
                        <option value={tjeneste.id} key={tjeneste.id}>{tjeneste.navn}</option>
                    )}
                </Select>
                <DatePicker {...datepickerProps}>
                    <DatePicker.Input {...inputProps}
                                      label="Tentativ frist"
                                      error={
                                          (ugyldig &&
                                              "Dette er ikke en gyldig dato. Gyldig format er DD.MM.ÅÅÅÅ") ||
                                          (forTidlig && "Frist kan tidligst være idag")
                                      }
                                      disabled={!brukerErEierAvSak}
                    />

                </DatePicker>
                <LeggTilKnapp onClick={leggTilLeveranse}
                              disabled={!brukerErEierAvSak || valgtIATjeneste === "" || !selectedDay}
                >
                    Legg til
                </LeggTilKnapp>
            </Form>
        </div>

    )
}

const iatjenesterStigendeEtterId = (a: IATjeneste, b: IATjeneste) => {
    return a.id - b.id;
}
