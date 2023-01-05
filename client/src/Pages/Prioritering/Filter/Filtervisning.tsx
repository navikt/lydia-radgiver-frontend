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
import { Eier, IAProsessStatusType, Kommune } from "../../../domenetyper";
import { useFiltervisningState } from "../../Virksomhet/filtervisning-reducer";
import { tabletAndUp } from "../../../styling/breakpoint";

export const sorteringsverdier = {
    tapte_dagsverk: "Tapte dagsverk",
    mulige_dagsverk: "Mulige dagsverk",
    antall_personer: "Antall arbeidsforhold",
    sykefraversprosent: "Sykefraværsprosent",
    navn: "Alfabetisk på navn",
} as const;

const Container = styled.div`
  padding: 1rem;
  ${hvitBoksMedSkygge}
`;

const Rad = styled.div`
  display: flex;
  column-gap: 3rem;
  row-gap: ${24 / 16}rem;
  flex-direction: column;
  flex-wrap: wrap;

  ${tabletAndUp} {
    flex-direction: row;
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

interface FiltervisningProps {
    filtervisning: Filtervisning;
    søkPåNytt: () => void;
    className?: string;
}

export const Filtervisning = ({ filtervisning, søkPåNytt, className }: FiltervisningProps) => {
    const {
        oppdaterAntallArbeidsforhold,
        oppdaterIastatus,
        oppdaterEiere,
        oppdaterFylke,
        state,
        oppdaterKommuner,
        oppdaterSykefraværsprosent,
        oppdaterNæringsgruppe,
    } = filtervisning;

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

    return (
        <Container className={className}>
            <Rad>
                <Fylkedropdown
                    fylkerOgKommuner={state.filterverdier?.fylker ?? []}
                    valgtFylke={state.valgtFylke?.fylke}
                    endreFylke={endreFylke}
                    style={{ flex: "1" }}
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
            <Næringsgruppedropdown
                bransjeprogram={state.filterverdier?.bransjeprogram ?? []}
                næringsgrupper={state.filterverdier?.neringsgrupper ?? []}
                valgtBransjeprogram={state.bransjeprogram ?? []}
                valgtNæringsgruppe={state.næringsgrupper}
                endreNæringsgrupper={endreNæringsgruppe}
            />
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
                <IAStatusDropdown
                    endreStatus={endreStatus}
                    statuser={state.filterverdier?.statuser ?? []}
                    valgtStatus={state.iaStatus}
                />
                <EierDropdown
                    filtrerbareEiere={
                        state.filterverdier?.filtrerbareEiere ?? []
                    }
                    eier={state.eiere}
                    onEierBytteCallback={endreEiere}
                />
                <Søkeknapp size="medium" onClick={søkPåNytt}>
                    Søk
                </Søkeknapp>
            </Rad>
        </Container>
    );
};