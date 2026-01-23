import { Button, Checkbox } from "@navikt/ds-react";
import { Range, SykefraværsprosentVelger } from "./SykefraværsprosentVelger";
import { Næringsgruppedropdown } from "./NæringsgruppeDropdown";
import { IAStatusDropdown } from "./IAStatusDropdown";
import { Kommunedropdown } from "./Kommunedropdown";
import { AntallArbeidsforholdVelger } from "./AntallArbeidsforholdVelger";
import { EierDropdown } from "./EierDropdown";
import { Eier, IAProsessStatusType } from "../../../domenetyper/domenetyper";
import { useFiltervisningState } from "./filtervisning-reducer";
import { SektorDropdown } from "./SektorDropdown";
import { FylkeMedKommuner, Kommune } from "../../../domenetyper/fylkeOgKommune";
import { BransjeEllerNæringDropdown } from "./BransjeEllerNæringDropdown";
import { useSearchParams } from "react-router-dom";
import {
    loggTogglingAvAutosøk,
    loggTømmingAvFilterverdier,
} from "../../../util/analytics-klient";
import { FylkeMultidropdown } from "./FylkeMultidropdown";
import styles from "./filter.module.scss";

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
        <form
            className={
                className
                    ? `${styles.filtervisningForm} ${className}`
                    : styles.filtervisningForm
            }
            onSubmit={(e) => e.preventDefault()}
        >
            <div className={styles.rad}>
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
            </div>
            <br />
            <div className={styles.rad}>
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
            </div>
            <br />
            <div className={styles.rad}>
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
            </div>
            <br />
            <div className={styles.rad}>
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
                <div className={styles.knappewrapper}>
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
                    <Button
                        className={styles.søkeknapp}
                        size="medium"
                        onClick={søkPåNytt}
                        loading={laster}
                    >
                        {søkeknappTittel ? søkeknappTittel : "Søk"}
                    </Button>
                </div>
            </div>
        </form>
    );
};
