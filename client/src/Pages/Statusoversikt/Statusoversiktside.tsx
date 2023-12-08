import { useEffect, useState } from "react";
import { BodyShort, Loader } from "@navikt/ds-react";
import { FEATURE_TOGGLE__FLAG_AUTOSØK__ER_AKTIVERT, Filtervisning } from "../Prioritering/Filter/Filtervisning";
import { sammenliknFilterverdier, useFiltervisningState } from "../Prioritering/Filter/filtervisning-reducer";
import { useFilterverdier, useHentStatusoversikt } from "../../api/lydia-api";
import { Statusoversikt } from "../../domenetyper/statusoversikt";
import { statiskeSidetitler, useTittel } from "../../util/useTittel";
import { StatistikkTabell } from "./StatistikkTabell";
import { SideContainer } from "../../styling/containere";
import { loggSideLastet, Søkekomponenter } from "../../util/amplitude-klient";
import { loggSøkMedFilterIAmplitude } from "../Prioritering/loggSøkMedFilterIAmplitude";

export const Statusoversiktside = () => {
    useTittel(statiskeSidetitler.statusoversiktside)

    const [skalSøke, setSkalSøke] = useState(false);
    const [statusoversiktListe, setStatusoversiktListe] =
        useState<Statusoversikt[]>();

    const [filtervisningLoaded, setFiltervisningLoaded] = useState(false);
    const harSøktMinstEnGang = statusoversiktListe !== undefined;
    const fantResultaterISøk =
        harSøktMinstEnGang && statusoversiktListe.length > 0;
    const skalViseTabell = fantResultaterISøk && !skalSøke;

    const { data: filterverdier } = useFilterverdier();
    const filtervisning = useFiltervisningState();
    const [skalBrukeAutosøk, setSkalBrukeAutosøk] = useState(FEATURE_TOGGLE__FLAG_AUTOSØK__ER_AKTIVERT);
    const [gammelFilterState, setGammelFilterState] = useState(filtervisning.state);

    const {
        data: statusoversiktResultatFraApi,
        error,
        loading: lasterStatusoversiktResultatFraApi,
        validating: validererStatusoversiktResultatFraApi,
    } = useHentStatusoversikt({
        filterstate: filtervisning.state,
        initierSøk: skalSøke,
    });


    useEffect(() => {
        if (filterverdier && !filtervisningLoaded) {
            filtervisning.lastData({ filterverdier });
            setFiltervisningLoaded(true);
            loggSideLastet("Statusoversiktside");
        }
    });

    useEffect(() => {
        if (statusoversiktResultatFraApi) {
            setStatusoversiktListe(statusoversiktResultatFraApi.data);
            setSkalSøke(false);
        }
    }, [statusoversiktResultatFraApi]);

    const søkPåNytt = () => {
        loggSøkMedFilterIAmplitude(filtervisning.state, Søkekomponenter.STATUSOVERSIKT)
        setSkalSøke(true);
    }

    const harEndringIFilterverdi = sammenliknFilterverdier(gammelFilterState, filtervisning.state);
    const [autosøktimer, setAutosøktimer] = useState<NodeJS.Timeout | undefined>();

    useEffect(() => {
        if (!harEndringIFilterverdi && !skalSøke && skalBrukeAutosøk && FEATURE_TOGGLE__FLAG_AUTOSØK__ER_AKTIVERT) {
            setGammelFilterState(filtervisning.state);
            clearTimeout(autosøktimer);
            setAutosøktimer(setTimeout(() => setSkalSøke(true), 500));
        }
    }, [harEndringIFilterverdi, skalSøke, skalBrukeAutosøk]);

    return (
        <SideContainer>
            <Filtervisning
                tillatAutosøk={skalBrukeAutosøk}
                setTillatAutosøk={setSkalBrukeAutosøk}
                filtervisning={filtervisning}
                laster={validererStatusoversiktResultatFraApi || lasterStatusoversiktResultatFraApi}
                søkPåNytt={søkPåNytt}
                maskerteFiltre={["IA_STATUS", "SNITTFILTER"]}
                søkeknappTittel={'Hent statistikk'}
            />
            <br />
            {skalViseTabell ? (
                <StatistikkTabell lederstatistikkListe={statusoversiktListe} />
            ) : (
                harSøktMinstEnGang && !lasterStatusoversiktResultatFraApi && !error && <BodyShort>Søket ga ingen resultater</BodyShort>
            )}
            {lasterStatusoversiktResultatFraApi && (
                <Loader
                    title={"Henter statusoversikt"}
                    variant={"interaction"}
                    size={"xlarge"}
                />
            )}
            {error && (
                <BodyShort>
                    Noe gikk galt under uthenting av statusoversikt
                </BodyShort>
            )}
        </SideContainer>
    )
}
