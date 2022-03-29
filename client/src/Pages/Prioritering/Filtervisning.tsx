import {Filterverdier, Fylke, IAProsessStatusType, Kommune, Næringsgruppe, Søkeverdier,} from "../../domenetyper";
import {Button} from "@navikt/ds-react";
import {useState} from "react";
import {Range, SykefraværsprosentVelger} from "./SykefraværsprosentVelger";
import {HorizontalFlexboxDiv} from "./HorizontalFlexboxDiv";
import {Næringsgruppedropdown} from "./NæringsgruppeDropdown";
import {Fylkedropdown, fylkesnummerTilFylke, kommunenummerTilKommune} from "./Fylkedropdown";
import {Kommunedropdown} from "./Kommunedropdown";
import {Sorteringsmuligheter} from "./Sorteringsmuligheter";
import {IAStatusDropdown} from "./IAStatusDropdown";
import styled from "styled-components";

export const sorteringsverdier = {
    tapte_dagsverk: "Tapte dagsverk",
    sykefraversprosent: "Sykefraværsprosent",
} as const;

export type stateUpdater = (value: string) => void;

export const sorterAlfabetisk = (a: string, b: string) =>
    a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());

interface FiltervisningProps {
    filterverdier: Filterverdier;
    oppdaterSøkeverdier: (søkeverdier: Søkeverdier) => void;
    søkPåNytt: () => void;
    className?: string;
}

const næringsgruppeKoderTilNæringsgrupper = (
    næringsgruppeKoder: string[],
    næringsgrupper: Næringsgruppe[]
) => næringsgrupper.filter(({ kode }) => næringsgruppeKoder.includes(kode));

const filtrerKommunerPåValgtFylke = (fylke: Fylke, kommuner: Kommune[]) =>
    fylke
        ? kommuner.filter((kommune) => kommune.nummer.startsWith(fylke.nummer))
        : kommuner;

const Filtervisning = ({
    filterverdier,
    oppdaterSøkeverdier,
    søkPåNytt,
    className
}: FiltervisningProps) => {
    const [valgtFylke, setValgtFylke] = useState<Fylke>();
    const [valgtKommune, setValgtKommune] = useState<Kommune>();
    const [næringsGrupper, setNæringsGrupper] = useState<Næringsgruppe[]>([]);
    const [sykefraværsProsent, setSykefraværsprosent] = useState<Range>({
        fra: 0,
        til: 100,
    });
    const [IAStatus, setIAStatus] = useState<IAProsessStatusType>()
    const [sorteringsverdi, setSorteringsverdi] =
        useState<string>("tapte_dagsverk");

    const endreFylke = (fylkenummer: string) => {
        if (fylkenummer === valgtFylke?.nummer) return;
        const endretFylke = fylkesnummerTilFylke(
            fylkenummer,
            filterverdier.fylker
        );
        if (!endretFylke) {
            setValgtFylke(undefined)
            oppdaterSøkeverdier({
                fylker: []
            })
            return;
        }
        setValgtFylke(endretFylke);
        if (!valgtKommune?.nummer.startsWith(endretFylke.nummer))
            setValgtKommune(undefined);
        oppdaterSøkeverdier({
            fylker: [endretFylke],
            kommuner: [],
        });
    };
    const endreKommune = (kommunenummer: string) => {
        const endretKommune = kommunenummerTilKommune(
            kommunenummer,
            filterverdier.fylker
        );
        if (!endretKommune && kommunenummer.length > 0) return;
        setValgtKommune(endretKommune);
        oppdaterSøkeverdier({
            kommuner: endretKommune ? [endretKommune] : [],
        });
    };
    const endreNæringsgruppe = (næringsgruppeKoder: string[]) => {
        const endretNæringsgrupper = næringsgruppeKoderTilNæringsgrupper(
            næringsgruppeKoder,
            filterverdier.neringsgrupper
        );
        setNæringsGrupper(endretNæringsgrupper);
        oppdaterSøkeverdier({
            neringsgrupper: endretNæringsgrupper,
        });
    };

    const oppdaterSykefraværsprosent = (sykefraværsprosentRange: Range) => {
        setSykefraværsprosent(sykefraværsprosentRange);
        oppdaterSøkeverdier({
            sykefraversprosentRange: sykefraværsprosentRange,
        });
    };
    const alleKommuner = filterverdier.fylker.flatMap(
        ({ kommuner }) => kommuner
    );
    const relevanteKommuner = valgtFylke
        ? filtrerKommunerPåValgtFylke(valgtFylke, alleKommuner)
        : alleKommuner;
    return (
        <div className={className}>
            <HorizontalFlexboxDiv>
                <Fylkedropdown
                    fylkerOgKommuner={filterverdier.fylker}
                    valgtFylke={valgtFylke}
                    endreFylke={endreFylke}
                />
                <Kommunedropdown
                    kommuner={relevanteKommuner}
                    valgtKommune={valgtKommune}
                    endreKommune={endreKommune}
                />
            </HorizontalFlexboxDiv>
            <br />
            <Næringsgruppedropdown
                næringsgrupper={filterverdier.neringsgrupper}
                valgtNæringsgruppe={næringsGrupper}
                endreNæringsgrupper={endreNæringsgruppe}
            />
            <br />
            <SykefraværsprosentVelger
                sykefraværsprosentRange={sykefraværsProsent}
                endre={(nySykefraværsprosentRange: Range) =>
                    oppdaterSykefraværsprosent(nySykefraværsprosentRange)
                }
            />
            <br />
            <HorizontalFlexboxDiv>
                <Sorteringsmuligheter
                    valgtSortering={sorteringsverdi}
                    sorteringsMuligheter={filterverdier.sorteringsnokler}
                    endreSortering={(
                        sortering: keyof typeof sorteringsverdier
                    ) => {
                        setSorteringsverdi(sortering);
                        oppdaterSøkeverdier({
                            sorteringsnokkel: sortering,
                        });
                    }}
                />
                <IAStatusDropdown
                    endreStatus={(iastatus) => {
                        setIAStatus(iastatus)
                        oppdaterSøkeverdier({
                            iastatus
                        })
                    }}
                    statuser={filterverdier.statuser}
                    valgtStatus={IAStatus}
                />
                <Button
                    size="small"
                    onClick={() => {
                        søkPåNytt();
                    }}
                >
                    Søk
                </Button>
            </HorizontalFlexboxDiv>
        </div>
    );
};

export const StyledFiltervisning = styled(Filtervisning)`
    background-color: white;
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px rgba(38, 38, 38, 0.12), 0px 1px 3px rgba(38, 38, 38, 0.2);
`

export default Filtervisning;
