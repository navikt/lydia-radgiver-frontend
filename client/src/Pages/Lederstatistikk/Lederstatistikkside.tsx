import { useEffect, useState } from "react";
import { BodyShort, Loader } from "@navikt/ds-react";
import { Filtervisning } from "../Prioritering/Filter/Filtervisning";
import { useFiltervisningState } from "../Prioritering/Filter/filtervisning-reducer";
import { useFilterverdier, useHentLederstatistikk } from "../../api/lydia-api";
import { Lederstatistikk } from "../../domenetyper/lederstatistikk";
import { statiskeSidetitler, useTittel } from "../../util/useTittel";
import { StatistikkTabell } from "./StatistikkTabell";
import { SideContainer } from "../../styling/containere";

export const Lederstatistikkside = () => {
    useTittel(statiskeSidetitler.lederstatistikkside)

    const [lederstatistikkListe, setLederstatistikkListe] =
        useState<Lederstatistikk[]>();
    const [skalSøke, setSkalSøke] = useState(false);

    const [filtervisningLoaded, setFiltervisningLoaded] = useState(false);
    const harSøktMinstEnGang = lederstatistikkListe !== undefined;
    const fantResultaterISøk =
        harSøktMinstEnGang && lederstatistikkListe.length > 0;
    const skalViseTabell = fantResultaterISøk && !skalSøke;

    const { data: filterverdier } = useFilterverdier();
    const filtervisning = useFiltervisningState();

    const {
        data: lederstatistikkResultatFraApi,
        error,
        loading,
    } = useHentLederstatistikk({
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
        if (lederstatistikkResultatFraApi) {
            setLederstatistikkListe(lederstatistikkResultatFraApi.data);
            setSkalSøke(false);
        }
    }, [lederstatistikkResultatFraApi]);

    return (
        <SideContainer>
            <Filtervisning
                filtervisning={filtervisning}
                søkPåNytt={() => {
                    setSkalSøke(true);
                }}
                maskerteFiltre={["IA_STATUS", "EIER"]}
                søkeknappTittel={'Hent statistikk'}
            />
            <br />
            {skalViseTabell ? (
                <StatistikkTabell lederstatistikkListe={lederstatistikkListe} />
            ) : (
                harSøktMinstEnGang && !loading && !error && <BodyShort>Søket ga ingen resultater</BodyShort>
            )}
            {loading && (
                <Loader
                    title={"Henter lederstatistikk"}
                    variant={"interaction"}
                    size={"xlarge"}
                />
            )}
            {error && (
                <BodyShort>
                    Noe gikk galt under uthenting av lederstatistikk
                </BodyShort>
            )}
        </SideContainer>
    )
}
