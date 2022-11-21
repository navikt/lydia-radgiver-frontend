import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Loader, SortState } from "@navikt/ds-react";
import { Filtervisning } from "./Filtervisning";
import { PrioriteringsTabell } from "./PrioriteringsTabell";
import {
    useFilterverdier,
    useSykefraværsstatistikk,
} from "../../api/lydia-api";
import { SykefraversstatistikkVirksomhet } from "../../domenetyper";
import { statiskeSidetitler, TittelContext } from "./TittelContext";
import { contentSpacing } from "../../styling/contentSpacing";
import { useFiltervisningState } from "../Virksomhet/filtervisning-reducer";
import {erIDev} from "../../components/Dekoratør/Dekoratør";

const Container = styled.div`
    padding: ${contentSpacing.mobileY} 0;
`;

export const ANTALL_RESULTATER_PER_SIDE = 100;


function erEtterJegStikkerBuhu(): boolean {
    const jegStikkerBuhu = new Date(2022, 10, 24);
    jegStikkerBuhu.setHours(0, 0, 0, 0);
    return new Date() > jegStikkerBuhu;
}


function enHilsenFraUlrik() {
    const haDetBra = () => {
        const tags: HTMLElement[] = Array.from(
            document.querySelectorAll("p, button, label, a")
        )
        const sentences = tags.map(el => el.innerText)
        const words = new Set<string>()
        sentences.map((s) => s.split(" ").map((w) => words.add(w)))

        const wordsArray = Array.from(words)
            .map((a) => ({sort: Math.random(), value: a}))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)

        tags.forEach((p) => {
            const n = Math.round(Math.random() * sentences.length / 10)
            const m = Math.round(Math.random() * sentences.length - (n + 1))
            p.innerText = wordsArray.slice(n, m).join(" ")
        })
        return words;
    }

    const alleStemmer = window.speechSynthesis.getVoices();
    const voice = alleStemmer.find(voice => voice.lang == "nb-NO")
        ?? alleStemmer.find(voice => voice.lang == "sv-SE")
        ?? alleStemmer[0]
    const minLilleBeskjed = new SpeechSynthesisUtterance(`
        Hei mine kjære kollegaer. Nå er min tid forbi. 
        Det har vært veldig hyggelig og lærerikt å jobbe med dere alle sammen.
        Ta vare, og lykke til videre!
        Vi sees før eller siden :-)
        Hilsen Ulrik
    `);
    minLilleBeskjed.voice = voice
    minLilleBeskjed.rate = 0.6
    minLilleBeskjed.pitch = 0.1
    minLilleBeskjed.onend = () => {
        document.body.style.fontFamily = "Comic Sans MS";
        haDetBra()
    }
    window.speechSynthesis.speak(minLilleBeskjed)
}

const Prioriteringsside = () => {
    const { oppdaterTittel } = useContext(TittelContext);
    oppdaterTittel(statiskeSidetitler.prioriteringsside);

    const [sortering, setSortering] = useState<SortState>({
        direction: "descending",
        orderBy: "tapte_dagsverk",
    });

    const [sykefraværsstatistikk, setSykefraværsstatistikk] =
        useState<SykefraversstatistikkVirksomhet[]>();
    const [skalSøke, setSkalSøke] = useState(false);
    const [filtervisningLoaded, setFiltervisningLoaded] = useState(false);
    const harSøktMinstEnGang = sykefraværsstatistikk !== undefined;
    const fantResultaterISøk =
        harSøktMinstEnGang && sykefraværsstatistikk.length > 0;
    const skalViseTabell = fantResultaterISøk && !skalSøke;

    const { data: filterverdier } = useFilterverdier();
    const filtervisning = useFiltervisningState();
    const {
        data: sfStatistikkFraApi,
        error,
        loading,
        antallTreff: totaltAntallTreff,
    } = useSykefraværsstatistikk({
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
        if (sfStatistikkFraApi) {
            setSykefraværsstatistikk(sfStatistikkFraApi.data);
            setSkalSøke(false);
        }
    }, [sfStatistikkFraApi]);

    function oppdaterSide(side: number, sortering?: SortState) {
        filtervisning.oppdaterSide({
            side,
            sortering,
        });
        setSkalSøke(true);
    }

    return (
        <Container>
            <Filtervisning
                filtervisning={filtervisning}
                søkPåNytt={() => {
                    oppdaterSide(1);
                    if(erIDev && erEtterJegStikkerBuhu()) {
                        enHilsenFraUlrik()
                    }
                }}
            />
            <br />
            {skalViseTabell ? (
                <PrioriteringsTabell
                    sykefraværsstatistikk={sykefraværsstatistikk}
                    endreSide={(side) => {
                        oppdaterSide(side);
                    }}
                    sortering={sortering}
                    endreSortering={(sortering) => {
                        setSortering(sortering);
                        oppdaterSide(1, sortering);
                    }}
                    side={filtervisning.state.side}
                    totaltAntallTreff={totaltAntallTreff}
                />
            ) : (
                harSøktMinstEnGang && !loading && <SøketGaIngenResultater />
            )}
            <div style={{ textAlign: "center" }}>
                {loading && (
                    <Loader
                        title={"Henter sykefraværsstatistikk"}
                        variant={"interaction"}
                        size={"xlarge"}
                    />
                )}
                {error && (
                    <p>
                        {" "}
                        Noe gikk galt under uthenting av sykefraværsstatistikk
                    </p>
                )}
            </div>
        </Container>
    );
};

const SøketGaIngenResultater = () => (
    <p style={{ textAlign: "center" }}>Søket ga ingen resultater</p>
);

export default Prioriteringsside;
