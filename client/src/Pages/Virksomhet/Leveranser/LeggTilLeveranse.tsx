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
import { IATjeneste, Leveranse, Modul } from "../../../domenetyper/leveranse";
import { sorterAlfabetisk } from "../../../util/sortering";
import { RolleEnum } from "../../../domenetyper/brukerinformasjon";

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
        data: leveranserPerIATjeneste
    } = useHentLeveranser(iaSak.orgnr, iaSak.saksnummer);
    const {
        data: iaTjenester,
        loading: lasterIATjenester
    } = useHentIATjenester();
    const {
        data: moduler,
        loading: lasterModuler
    } = useHentModuler();
    const [valgtIATjeneste, setValgtIATjeneste] = useState("");
    const [valgtModul, setValgtModul] = useState("");
    const { mutate: hentLeveranserPåNytt } = useHentLeveranser(iaSak.orgnr, iaSak.saksnummer)
    const { mutate: hentSakPåNytt } = useHentAktivSakForVirksomhet(iaSak.orgnr)


    const { datepickerProps, inputProps, selectedDay } = useDatepicker({
        fromDate: new Date(),
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
            .then(() => {
                hentLeveranserPåNytt()
                hentSakPåNytt()
            })
    }

    const erModulIkkeValgt = (modul: Modul): boolean => {
        if (!leveranserPerIATjeneste || leveranserPerIATjeneste.length === 0) {
            return true;
        }

        return leveranserPerIATjeneste
            .flatMap(tjenesteMedValgteLeveranser => tjenesteMedValgteLeveranser.leveranser)
            .every((leveranse: Leveranse) => leveranse.modul.id !== modul.id)
    }

    return (
        <div>
            <Heading size="small">Legg til ny leveranse</Heading>
            {!brukerErEierAvSak &&
                <BodyShort spacing={true}>Du må være eier av saken for å kunne legge til leveranser</BodyShort>
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
                <Select label="Modul" value={valgtModul} onChange={endreValgtModul} disabled={!brukerErEierAvSak}>
                    <option value="">{lasterModuler && "Laster moduler..."}</option>
                    {moduler?.filter((modul) => modul.iaTjeneste.toString() === valgtIATjeneste)
                        .filter((modul) => erModulIkkeValgt(modul))
                        .sort(modulAlfabetiskPåNavn)
                        .map((modul) =>
                            <option value={modul.id} key={modul.id}>{modul.navn}</option>
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
                <LeggTilKnapp onClick={leggTilLeveranse} disabled={!brukerErEierAvSak || valgtModul === "" || !selectedDay}>Legg til</LeggTilKnapp>
            </Form>
        </div>

    )
}

const iatjenesterStigendeEtterId = (a: IATjeneste, b: IATjeneste) => {
    return a.id - b.id;
}

const modulAlfabetiskPåNavn = (a: Modul, b: Modul) => {
    return sorterAlfabetisk(a.navn, b.navn)
}
