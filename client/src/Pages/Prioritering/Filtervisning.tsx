import styled from "styled-components";
import { Button } from "@navikt/ds-react";
import { Range, SykefraværsprosentVelger } from "./SykefraværsprosentVelger";
import { HorizontalFlexboxDivGap3RemAlignItemsEnd } from "./HorizontalFlexboxDiv";
import { Næringsgruppedropdown } from "./NæringsgruppeDropdown";
import { Fylkedropdown } from "./Fylkedropdown";
import { IAStatusDropdown } from "./IAStatusDropdown";
import { Kommunedropdown } from "./Kommunedropdown";
import { AntallArbeidsforholdVelger } from "./AntallArbeidsforholdVelger";
import { EierDropdown } from "./EierDropdown";
import { hvitBoksMedSkygge } from "../../styling/containere";
import { Eier, IAProsessStatusType, Kommune } from "../../domenetyper";
import { useFiltervisningState } from "../Virksomhet/filtervisning-reducer";

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

const Søkeknapp = styled(Button)`
    align-self: end;
    margin-left: auto;

    width: 10rem;
    height: fit-content;
`;

interface FiltervisningProps {
    filtervisning: ReturnType<typeof useFiltervisningState>;
    søkPåNytt: () => void;
    className?: string;
}

export const Filtervisning = ({
    filtervisning,
    søkPåNytt,
    className,
}: FiltervisningProps) => {
    const {
        iastatus,
        antallArbeidsforhold: updateAntallArbeidsforhold,
        sykefraværsprosent,
        fylke,
        state,
        næringsgruppe,
        kommuner: updateKommuner,
        oppdaterEiere,
    } = filtervisning;

    const endreFylke = (fylkesnummer: string) => {
        fylke({ fylkesnummer });
    };

    const endreKommuner = (kommuner: Kommune[]) => {
        updateKommuner({ kommuner });
    };

    const endreNæringsgruppe = (næringsgruppeKoder: string[]) => {
        næringsgruppe({ næringsgrupper: næringsgruppeKoder });
    };

    const oppdaterSykefraværsprosent = (sykefraværsprosentRange: Range) => {
        sykefraværsprosent({ sykefraværsprosent: sykefraværsprosentRange });
    };

    const endreAntallArbeidsforhold = (antallArbeidsforhold: Range) => {
        updateAntallArbeidsforhold({ arbeidsforhold: antallArbeidsforhold });
    };

    const endreStatus = (iaStatus?: IAProsessStatusType) => {
        iastatus({ iastatus: iaStatus });
    };

    const endreEiere = (eiere?: Eier[]) => {
        oppdaterEiere({ eiere });
    };

    return (
        <Container className={className}>
            <HorizontalFlexboxDivGap3RemAlignItemsEnd>
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
            </HorizontalFlexboxDivGap3RemAlignItemsEnd>
            <br />
            <Næringsgruppedropdown
                bransjeprogram={state.filterverdier?.bransjeprogram ?? []}
                næringsgrupper={state.filterverdier?.neringsgrupper ?? []}
                valgtNæringsgruppe={state.næringsgrupper}
                endreNæringsgrupper={endreNæringsgruppe}
            />
            <br />
            <HorizontalFlexboxDivGap3RemAlignItemsEnd>
                <SykefraværsprosentVelger
                    sykefraværsprosentRange={state.sykefraværsprosent}
                    endre={oppdaterSykefraværsprosent}
                />
                <AntallArbeidsforholdVelger
                    antallArbeidsforhold={state.antallArbeidsforhold}
                    endreAntallArbeidsforhold={endreAntallArbeidsforhold}
                />
            </HorizontalFlexboxDivGap3RemAlignItemsEnd>
            <br />
            <HorizontalFlexboxDivGap3RemAlignItemsEnd>
                <IAStatusDropdown
                    endreStatus={endreStatus}
                    statuser={state.filterverdier?.statuser ?? []}
                    valgtStatus={state.iaStatus}
                />
                <EierDropdown
                    filtrerbareEiere={
                        state.filterverdier?.filtrerbareEiere ?? []
                    }
                    onEierBytteCallback={(eiere) => {
                        endreEiere(eiere);
                    }}
                />
                <Søkeknapp size="medium" onClick={søkPåNytt}>
                    Søk
                </Søkeknapp>
            </HorizontalFlexboxDivGap3RemAlignItemsEnd>
        </Container>
    );
};
