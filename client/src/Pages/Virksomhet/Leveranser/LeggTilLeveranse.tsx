import { useState } from "react";
import { BodyShort, Button, DatePicker, Heading, Select, useDatepicker } from "@navikt/ds-react";
import {
    nyLeveransePåSak,
    useHentAktivSakForVirksomhet,
    useHentBrukerinformasjon,
    useHentIATjenester,
    useHentLeveranser
} from "../../../api/lydia-api";
import { IASak } from "../../../domenetyper/domenetyper";
import styled from "styled-components";
import { IATjeneste, LeveranserPerIATjeneste } from "../../../domenetyper/leveranse";
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
    const [valgtIATjeneste, setValgtIATjeneste] = useState("");
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
        setValgtIATjeneste(e.target.value);
    }

    const leggTilLeveranse = () => {
        if (valgtIATjeneste === "" || !selectedDay) {
            return;
        }
        const modulFraTjeneste = finnModulForIATjeneste(Number(valgtIATjeneste), leveranserPerIATjeneste)
        if (!modulFraTjeneste) {
            return;
        }
        nyLeveransePåSak(iaSak.orgnr, iaSak.saksnummer, modulFraTjeneste.id, selectedDay)
            .then(() => {
                hentLeveranserPåNytt()
                hentSakPåNytt()
            })
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
                <LeggTilKnapp onClick={leggTilLeveranse} disabled={!brukerErEierAvSak || valgtIATjeneste === "" || !selectedDay}>Legg til</LeggTilKnapp>
            </Form>
        </div>
    )
}

const iatjenesterStigendeEtterId = (a: IATjeneste, b: IATjeneste) => {
    return a.id - b.id;
}
export const finnModulForIATjeneste = (IATjeneste : number, leveranserPerIATjeneste? : LeveranserPerIATjeneste[]) => {
    return leveranserPerIATjeneste?.find((iatjeneste) =>
        iatjeneste.iaTjeneste.id === IATjeneste
    )?.leveranser[0]
}
