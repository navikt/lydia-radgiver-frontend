import {
    Filterverdier,
    Fylke,
    IAProsessStatusType,
    Kommune,
    Næringsgruppe,
    Sorteringsverdi,
    Søkeverdier,
} from "../../domenetyper";
import {Button} from "@navikt/ds-react";
import {useMemo, useState} from "react";
import {Range, SykefraværsprosentVelger} from "./SykefraværsprosentVelger";
import {HorizontalFlexboxDiv} from "./HorizontalFlexboxDiv";
import {Næringsgruppedropdown} from "./NæringsgruppeDropdown";
import {Fylkedropdown, fylkesnummerTilFylke} from "./Fylkedropdown";
import {Sorteringsmuligheter} from "./Sorteringsmuligheter";
import {IAStatusDropdown} from "./IAStatusDropdown";
import styled from "styled-components";
import {hvitRammeMedBoxShadow} from "../../styling/containere";
import {Kommunedropdown} from "./Kommunedropdown";

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

const Søkeknapp = styled(Button)`
    width: 10rem;
`

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
    const [valgtKommuner, setValgtKommuner] = useState<Kommune[]>([]);
    const [næringsGrupper, setNæringsGrupper] = useState<Næringsgruppe[]>([]);
    const [sykefraværsProsent, setSykefraværsprosent] = useState<Range>({
        fra: 0,
        til: 100,
    });
    const [IAStatus, setIAStatus] = useState<IAProsessStatusType>()
    const [sorteringsverdi, setSorteringsverdi] =
        useState<Sorteringsverdi>("tapte_dagsverk");

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
        const kommuner = valgtKommuner.filter(k => k.nummer.startsWith(endretFylke.nummer))
        setValgtKommuner(kommuner);
        oppdaterSøkeverdier({
            fylker: [endretFylke],
            kommuner,
        });
    };
    const endreKommuner = (kommuner: Kommune[]) => {
        setValgtKommuner(kommuner);
        oppdaterSøkeverdier({
            kommuner,
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
    const relevanteKommuner = useMemo(() => {
        if (valgtFylke) {
            return filtrerKommunerPåValgtFylke(valgtFylke, alleKommuner)
        }
        console.log('valgtfylke')
        console.log('filterverdier', filterverdier)
        console.log('allekommuner', alleKommuner)
        return alleKommuner
    }, [valgtFylke])
    return (
        <div className={className}>
            <HorizontalFlexboxDiv>
                <Fylkedropdown
                    fylkerOgKommuner={filterverdier.fylker}
                    valgtFylke={valgtFylke}
                    endreFylke={endreFylke}
                />
            </HorizontalFlexboxDiv>
            <br />
            <Kommunedropdown
                kommuner={relevanteKommuner}
                valgtKommuner={valgtKommuner}
                endreKommuner={endreKommuner}
            />
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
                        sortering
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
                <Søkeknapp
                    size="medium"
                    onClick={() => {
                        søkPåNytt();
                    }}
                >
                    Søk
                </Søkeknapp>
            </HorizontalFlexboxDiv>
        </div>
    );
};

export const StyledFiltervisning = styled(Filtervisning)`
    ${hvitRammeMedBoxShadow}
    padding: 1rem;
`
