import styled from "styled-components";
import { Button, Checkbox } from "@navikt/ds-react";
import { Range, SykefraværsprosentVelger } from "./SykefraværsprosentVelger";
import { Næringsgruppedropdown } from "./NæringsgruppeDropdown";
import { IAStatusDropdown } from "./IAStatusDropdown";
import { Kommunedropdown } from "./Kommunedropdown";
import { AntallArbeidsforholdVelger } from "./AntallArbeidsforholdVelger";
import { EierDropdown } from "./EierDropdown";
import { hvitBoksMedSkygge } from "../../../styling/containere";
import { Eier, IAProsessStatusType } from "../../../domenetyper/domenetyper";
import { useFiltervisningState } from "./filtervisning-reducer";
import { tabletAndUp } from "../../../styling/breakpoints";
import { SektorDropdown } from "./SektorDropdown";
import { FylkeMedKommuner, Kommune } from "../../../domenetyper/fylkeOgKommune";
import { BransjeEllerNæringDropdown } from "./BransjeEllerNæringDropdown";
import { useSearchParams } from "react-router-dom";
import {
    loggTogglingAvAutosøk,
    loggTømmingAvFilterverdier,
} from "../../../util/amplitude-klient";
import { FylkeMultidropdown } from "./FylkeMultidropdown";

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

const KnappeWrapper = styled.div`
    align-self: end;
    margin-left: auto;

    display: flex;
    gap: 1.5rem;

    height: fit-content;
`;

const Søkeknapp = styled(Button)`
    width: 10rem;
`;

type Filtervisning = Omit<
    ReturnType<typeof useFiltervisningState>,
    "lastData" | "oppdaterSide" // Disse funksjonene er ikke relevante for denne komponenten, derfor fjernes de fra typen.
>;

export type Filter = "IA_STATUS" | "EIER" | "SNITTFILTER";

interface FiltervisningProps {
    filtervisning: Filtervisning;
    søkPåNytt: () => void;
    maskerteFiltre?: Filter[];
    søkeknappTittel?: string;
    className?: string;
    laster?: boolean;
}

export const Filtervisning = ({
    filtervisning,
    søkPåNytt,
    className,
    maskerteFiltre,
    søkeknappTittel,
    laster,
}: FiltervisningProps) => {
    const [søkeparametre] = useSearchParams();
    const {
        oppdaterAntallArbeidsforhold,
        oppdaterIastatus,
        oppdaterEiere,
        oppdaterFylker,
        state,
        oppdaterKommuner,
        oppdaterSykefraværsprosent,
        oppdaterSnittfilter,
        oppdaterNæringsgruppe,
        oppdaterSektorer,
        oppdaterAutosøk,
        tilbakestill,
    } = filtervisning;

    const endreSektor = (sektor: string) => {
        oppdaterSektorer({ sektor });
    };

    const endrerFylker = (fylker: FylkeMedKommuner[]) => {
        oppdaterFylker({ fylker });
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

    const endreSnittfilter = (snittfilter: string) => {
        oppdaterSnittfilter({ snittfilter: snittfilter });
    };

    const endreAntallArbeidsforhold = (antallArbeidsforhold: Range) => {
        oppdaterAntallArbeidsforhold({ arbeidsforhold: antallArbeidsforhold });
    };

    const endreStatus = (iaStatus?: IAProsessStatusType) => {
        oppdaterIastatus({ iastatus: iaStatus });
    };

    const endreEiere = (eiere: Eier[]) => {
        oppdaterEiere({ eiere });
    };

    const endreAutosøk = (autosøk: boolean) => {
        oppdaterAutosøk({ autosøk });
        loggTogglingAvAutosøk(autosøk);
    };

    const skalFilterVises = (filter: Filter): boolean => {
        return maskerteFiltre ? !maskerteFiltre.includes(filter) : true;
    };

    const harFilterÅTømme = søkeparametre.size > 0;
    const tømFilter = () => {
        tilbakestill();
        loggTømmingAvFilterverdier();
    };

    return (
        <Skjema className={className} onSubmit={(e) => e.preventDefault()}>
            <Rad>
                <FylkeMultidropdown
                    fylkerOgKommuner={state.filterverdier?.fylker ?? []}
                    valgteFylker={state.valgteFylker ?? []}
                    endreFylker={endrerFylker}
                    style={{ flex: "2" }}
                />
                {/*
                <Fylkedropdown
                    fylkerOgKommuner={state.filterverdier?.fylker ?? []}
                    valgtFylke={state.valgtFylke?.fylke}
                    endreFylke={endreFylke}
                    style={{ flex: "1" }}
                />
*/}
                <Kommunedropdown
                    relevanteFylkerMedKommuner={
                        state.valgteFylker && state.valgteFylker.length > 0
                            ? state.valgteFylker
                            : (state.filterverdier?.fylker ?? [])
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
                    næringsgrupper={state.filterverdier?.naringsgrupper ?? []}
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
                {skalFilterVises("SNITTFILTER") && (
                    <BransjeEllerNæringDropdown
                        valgtSnittfilter={state.valgtSnittfilter}
                        endreSnittfilter={endreSnittfilter}
                    />
                )}
                <AntallArbeidsforholdVelger
                    antallArbeidsforhold={state.antallArbeidsforhold}
                    endreAntallArbeidsforhold={endreAntallArbeidsforhold}
                />
            </Rad>
            <br />
            <Rad>
                {skalFilterVises("IA_STATUS") && (
                    <IAStatusDropdown
                        endreStatus={endreStatus}
                        statuser={state.filterverdier?.statuser ?? []}
                        valgtStatus={state.iaStatus}
                    />
                )}
                {skalFilterVises("EIER") && (
                    <EierDropdown
                        filtrerbareEiere={
                            state.filterverdier?.filtrerbareEiere ?? []
                        }
                        eiere={state.eiere}
                        onEierBytteCallback={endreEiere}
                    />
                )}
                <KnappeWrapper>
                    {harFilterÅTømme && (
                        <Button
                            type="button"
                            size="medium"
                            variant="tertiary"
                            onClick={tømFilter}
                        >
                            Tøm filter
                        </Button>
                    )}
                    <Checkbox
                        checked={state.autosøk}
                        onClick={() => {
                            endreAutosøk(!state.autosøk);
                        }}
                    >
                        Autosøk
                    </Checkbox>
                    <Søkeknapp
                        size="medium"
                        onClick={søkPåNytt}
                        loading={laster}
                    >
                        {søkeknappTittel ? søkeknappTittel : "Søk"}
                    </Søkeknapp>
                </KnappeWrapper>
            </Rad>
        </Skjema>
    );
};
