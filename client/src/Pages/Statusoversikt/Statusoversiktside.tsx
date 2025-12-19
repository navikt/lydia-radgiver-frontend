import { useEffect, useState } from "react";
import { BodyShort, Loader } from "@navikt/ds-react";
import { Filtervisning } from "../Prioritering/Filter/Filtervisning";
import {
    sammenliknFilterverdier,
    useFiltervisningState,
} from "../Prioritering/Filter/filtervisning-reducer";
import {
    useFilterverdier,
    useHentStatusoversikt,
} from "../../api/lydia-api/sok";
import { Statusoversikt } from "../../domenetyper/statusoversikt";
import { statiskeSidetitler, useTittel } from "../../util/useTittel";
import { StatistikkTabell } from "./StatistikkTabell";
import { loggSideLastet, Søkekomponenter } from "../../util/analytics-klient";
import { loggSøkMedFilterIAnalytics } from "../Prioritering/loggSøkMedFilterIAnalytics";
import SideContainer from "../../components/SideContainer";

export const Statusoversiktside = () => {
    useTittel(statiskeSidetitler.statusoversiktside);

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
    const [gammelFilterState, setGammelFilterState] = useState(
        filtervisning.state,
    );

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

    const SORTERINGS_REKKEFØLGE = [
        "IKKE_AKTIV",
        "VURDERES",
        "KONTAKTES",
        "KARTLEGGES",
        "VI_BISTÅR",
        "FULLFØRT",
        "IKKE_AKTUELL",
    ];
    const sorterEtterStatus = (liste: Statusoversikt[]) =>
        liste.sort(
            (a, b) =>
                SORTERINGS_REKKEFØLGE.indexOf(a.status) -
                SORTERINGS_REKKEFØLGE.indexOf(b.status),
        );

    useEffect(() => {
        if (statusoversiktResultatFraApi) {
            setStatusoversiktListe(
                sorterEtterStatus(statusoversiktResultatFraApi.data),
            );
            setSkalSøke(false);
        }
    }, [statusoversiktResultatFraApi]);

    const søkPåNytt = () => {
        loggSøkMedFilterIAnalytics(
            filtervisning.state,
            Søkekomponenter.STATUSOVERSIKT,
        );
        setSkalSøke(true);
    };

    const harEndringIFilterverdi = sammenliknFilterverdier(
        gammelFilterState,
        filtervisning.state,
    );
    const [autosøktimer, setAutosøktimer] = useState<
        NodeJS.Timeout | undefined
    >();

    useEffect(() => {
        if (
            !harEndringIFilterverdi &&
            !skalSøke &&
            filtervisning.state.autosøk
        ) {
            setGammelFilterState(filtervisning.state);
            clearTimeout(autosøktimer);
            setAutosøktimer(setTimeout(() => setSkalSøke(true), 500));
        }

        return () => {
            clearTimeout(autosøktimer);
        };
    }, [harEndringIFilterverdi, skalSøke, filtervisning.state.autosøk]);

    return (
        <SideContainer>
            <Filtervisning
                filtervisning={filtervisning}
                laster={
                    validererStatusoversiktResultatFraApi ||
                    lasterStatusoversiktResultatFraApi
                }
                søkPåNytt={søkPåNytt}
                maskerteFiltre={["IA_STATUS", "SNITTFILTER"]}
                søkeknappTittel={"Hent statistikk"}
            />
            <br />
            {skalViseTabell ? (
                <StatistikkTabell lederstatistikkListe={statusoversiktListe} />
            ) : (
                harSøktMinstEnGang &&
                !lasterStatusoversiktResultatFraApi &&
                !error && <BodyShort>Søket ga ingen resultater</BodyShort>
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
    );
};
