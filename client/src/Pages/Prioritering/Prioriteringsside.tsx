import { StyledFiltervisning } from "./Filtervisning";
import { StyledPrioriteringsTabell} from "./PrioriteringsTabell";
import {
  useFilterverdier,
  useSykefraværsstatistikk,
} from "../../api/lydia-api";
import {useEffect, useState} from "react";
import {
    Søkeverdier,
    Filterverdier,
    SykefraversstatistikkVirksomhet,
} from "../../domenetyper";
import {Loader} from "@navikt/ds-react";

const tommeFilterverdier: Filterverdier = {
    fylker: [],
    neringsgrupper: [],
    sorteringsnokler: [],
    statuser: []
};
const tomSykefraværsstatistikk: SykefraversstatistikkVirksomhet[] = [];

const Prioriteringsside = () => {
    const [sykefraværsstatistikk, setSykefraværsstatistikk] = useState(tomSykefraværsstatistikk)
    const [søkeverdier, setSøkeverdier] = useState<Søkeverdier>();
    const [skalSøke, setSkalSøke] = useState(false);
    const skalViseTabell = sykefraværsstatistikk && !skalSøke

    const {
        data: filterverdier,
    } = useFilterverdier();
    const {
        data: sfStatistikkFraApi,
        error,
    } = useSykefraværsstatistikk({ søkeverdier, initierSøk: skalSøke });
    useEffect(() => {
        if (sfStatistikkFraApi) {
            setSykefraværsstatistikk(sfStatistikkFraApi.data)
            setSkalSøke(false)
        }
    }, [sfStatistikkFraApi])

    return (
        <>
            <StyledFiltervisning
                filterverdier={filterverdier ?? tommeFilterverdier}
                oppdaterSøkeverdier={(nyeSøkeverdier: Søkeverdier) => {
                    setSøkeverdier({ ...søkeverdier, ...nyeSøkeverdier });
                    setSkalSøke(false)
                }}
                søkPåNytt={() => setSkalSøke(true)}
            />
            <br />
            {skalViseTabell && <StyledPrioriteringsTabell
                sykefraværsstatistikk={
                    sykefraværsstatistikk
                }
            />}
            <div style={{ textAlign : "center"}}>
                {skalSøke &&
                    <Loader
                        title={"Henter sykefraværsstatistikk"}
                        variant={"interaction"}
                        size={"xlarge"}
                    />
                }
                {error && <p>Feilet under uthenting av sykefraværsstatistikk</p>}
            </div>
        </>
    );
};

export default Prioriteringsside;
