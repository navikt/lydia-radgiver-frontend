import styled from "styled-components";
import { Button } from "@navikt/ds-react";
import { Range, SykefraværsprosentVelger } from "./SykefraværsprosentVelger";
import { Næringsgruppedropdown } from "./NæringsgruppeDropdown";
import { Fylkedropdown } from "./Fylkedropdown";
import { IAStatusDropdown } from "./IAStatusDropdown";
import { Kommunedropdown } from "./Kommunedropdown";
import { AntallArbeidsforholdVelger } from "./AntallArbeidsforholdVelger";
import { EierDropdown } from "./EierDropdown";
import { hvitBoksMedSkygge } from "../../../styling/containere";
import { Eier, IAProsessStatusType } from "../../../domenetyper/domenetyper";
import { useFiltervisningState } from "./filtervisning-reducer";
import { tabletAndUp } from "../../../styling/breakpoints";
import { SektorDropdown } from "./SektorDropdown";
import { Kommune } from "../../../domenetyper/fylkeOgKommune";


const Skjema = styled.form`
  padding: 1rem;
  ${hvitBoksMedSkygge}
`;

const Rad = styled.div`
  display: flex;
  column-gap: 3rem;
  row-gap: ${24 / 16}rem;
  flex-wrap: wrap;
  flex-direction: column;

  ${tabletAndUp} {
    flex-direction: row;
    align-items: start;
  }
`;


const Søkeknapp = styled(Button)`
  align-self: end;
  margin-left: auto;

  width: 10rem;
  height: fit-content;
`;

type Filtervisning = Omit<
    ReturnType<typeof useFiltervisningState>,
    "lastData" | "oppdaterSide" // Disse funksjonene er ikke relevante for denne komponenten, derfor fjernes de fra typen.
>;

export type Filter = "IA_STATUS" | "EIER";

interface FiltervisningProps {
    filtervisning: Filtervisning;
    søkPåNytt: () => void;
    maskerteFiltre?: Filter[];
    søkeknappTittel?: string;
    className?: string;
}

export const Filtervisning = ({filtervisning, søkPåNytt, className, maskerteFiltre, søkeknappTittel}: FiltervisningProps) => {
    const {
        oppdaterAntallArbeidsforhold,
        oppdaterIastatus,
        oppdaterEiere,
        oppdaterFylke,
        state,
        oppdaterKommuner,
        oppdaterSykefraværsprosent,
        oppdaterNæringsgruppe,
        oppdaterSektorer,
    } = filtervisning;

    const endreSektor = (sektor: string) => {
        oppdaterSektorer({ sektor })
    }

    const endreFylke = (fylkesnummer: string) => {
        oppdaterFylke({ fylkesnummer });
    };

    const endreKommuner = (kommuner: Kommune[]) => {
        oppdaterKommuner({ kommuner });
    };

    const endreNæringsgruppe = (næringsgruppeKoder: string[]) => {
        oppdaterNæringsgruppe({ næringsgrupper: næringsgruppeKoder });
    };

    const endreSykefraværsprosent = (sykefraværsprosentRange: Range) => {
        oppdaterSykefraværsprosent({
            sykefraværsprosent: sykefraværsprosentRange,
        });
    };

    const endreAntallArbeidsforhold = (antallArbeidsforhold: Range) => {
        oppdaterAntallArbeidsforhold({ arbeidsforhold: antallArbeidsforhold });
    };

    const endreStatus = (iaStatus?: IAProsessStatusType) => {
        oppdaterIastatus({ iastatus: iaStatus });
    };

    const endreEiere = (eiere?: Eier[]) => {
        oppdaterEiere({ eiere });
    };

    const skalFilterVises = (filter: Filter): boolean => {
        return maskerteFiltre ?
            !maskerteFiltre.includes(filter)
            : true;
    }

    return (
        <Skjema className={className} onSubmit={(e) => e.preventDefault()}>
            <Rad>
                <Fylkedropdown
                    fylkerOgKommuner={state.filterverdier?.fylker ?? []}
                    valgtFylke={state.valgtFylke?.fylke}
                    endreFylke={endreFylke}
                    style={{flex: "1"}}
                />
                <Kommunedropdown
                    relevanteFylkerMedKommuner={
                        state.valgtFylke
                            ? [state.valgtFylke]
                            : state.filterverdier?.fylker ?? []
                    }
                    valgteKommuner={state.kommuner}
                    endreKommuner={endreKommuner}
                    style={{ flex: "5" }}
                />
            </Rad>
            <br />
            <Rad>
                <Næringsgruppedropdown
                    bransjeprogram={state.filterverdier?.bransjeprogram ?? []}
                    næringsgrupper={state.filterverdier?.neringsgrupper ?? []}
                    valgtBransjeprogram={state.bransjeprogram ?? []}
                    valgtNæringsgruppe={state.næringsgrupper}
                    endreNæringsgrupper={endreNæringsgruppe}
                />
                <SektorDropdown
                    endreSektor={endreSektor}
                    sektorer={state.filterverdier?.sektorer ?? []}
                    valgtSektor={state.sektor}
                />
            </Rad>
            <br />
            <Rad>
                <SykefraværsprosentVelger
                    sykefraværsprosentRange={state.sykefraværsprosent}
                    endre={endreSykefraværsprosent}
                />
                <AntallArbeidsforholdVelger
                    antallArbeidsforhold={state.antallArbeidsforhold}
                    endreAntallArbeidsforhold={endreAntallArbeidsforhold}
                />
            </Rad>
            <br />
            <Rad>
                {skalFilterVises("IA_STATUS") &&
                    <IAStatusDropdown
                        endreStatus={endreStatus}
                        statuser={state.filterverdier?.statuser ?? []}
                        valgtStatus={state.iaStatus}
                    />
                }
                {skalFilterVises("EIER") &&
                    <EierDropdown
                        filtrerbareEiere={
                            state.filterverdier?.filtrerbareEiere ?? []
                        }
                        eier={state.eiere}
                        onEierBytteCallback={endreEiere}
                    />
                }
                <Søkeknapp size="medium" onClick={søkPåNytt}>
                    {søkeknappTittel? søkeknappTittel : 'Søk'}
                </Søkeknapp>
            </Rad>
        </Skjema>
    );
};
