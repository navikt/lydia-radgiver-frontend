import { useEffect, useState } from "react";
import { BodyShort, Loader } from "@navikt/ds-react";
import { Filtervisning } from "../Prioritering/Filter/Filtervisning";
import { useFiltervisningState } from "../Prioritering/Filter/filtervisning-reducer";
import { useFilterverdier, useHentStatusoversikt } from "../../api/lydia-api";
import { Statusoversikt } from "../../domenetyper/statusoversikt";
import { statiskeSidetitler, useTittel } from "../../util/useTittel";
import { StatistikkTabell } from "./StatistikkTabell";
import { SideContainer } from "../../styling/containere";

export const Statusoversiktside = () => {
    useTittel(statiskeSidetitler.statusoversiktside)

    const [statusoversiktListe, setStatusoversiktListe] =
        useState<Statusoversikt[]>();
    const [skalSøke, setSkalSøke] = useState(false);

    const [filtervisningLoaded, setFiltervisningLoaded] = useState(false);
    const harSøktMinstEnGang = statusoversiktListe !== undefined;
    const fantResultaterISøk =
        harSøktMinstEnGang && statusoversiktListe.length > 0;
    const skalViseTabell = fantResultaterISøk && !skalSøke;

    const { data: filterverdier } = useFilterverdier();
    const filtervisning = useFiltervisningState();

    const {
        data: statusoversiktResultatFraApi,
        error,
        loading,
    } = useHentStatusoversikt({
        filterstate: filtervisning.state,
        initierSøk: skalSøke,
    });


    useEffect(() => {
        if (filterverdier && !filtervisningLoaded) {
            filtervisning.lastData({ filterverdier });
            setFiltervisningLoaded(true);
        }
    });

    useEffect(() => {
        if (statusoversiktResultatFraApi) {
            setStatusoversiktListe(statusoversiktResultatFraApi.data);
            setSkalSøke(false);
        }
    }, [statusoversiktResultatFraApi]);

    return (
        <SideContainer>
            <Filtervisning
                filtervisning={filtervisning}
                søkPåNytt={() => {
                    setSkalSøke(true);
                }}
                maskerteFiltre={["IA_STATUS"]}
                søkeknappTittel={'Hent statistikk'}
            />
            <br />
            {skalViseTabell ? (
                <StatistikkTabell lederstatistikkListe={statusoversiktListe} />
            ) : (
                harSøktMinstEnGang && !loading && !error && <BodyShort>Søket ga ingen resultater</BodyShort>
            )}
            {loading && (
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