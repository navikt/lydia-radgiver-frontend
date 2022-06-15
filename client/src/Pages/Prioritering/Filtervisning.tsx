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
import {HorizontalFlexboxDivGap3RemAlignItemsEnd} from "./HorizontalFlexboxDiv";
import {Næringsgruppedropdown} from "./NæringsgruppeDropdown";
import {Fylkedropdown, fylkesnummerTilFylke} from "./Fylkedropdown";
import {Sorteringsmuligheter} from "./Sorteringsmuligheter";
import {IAStatusDropdown} from "./IAStatusDropdown";
import styled from "styled-components";
import {hvitRammeMedBoxShadow} from "../../styling/containere";
import {Kommunedropdown} from "./Kommunedropdown";
import {AntallAnsatteVelger} from "./AntallAnsatteVelger";
import {KunMineVirksomheterToggle} from "./KunMineVirksomheterToggle";

export const sorteringsverdier = {
    tapte_dagsverk: "Tapte dagsverk",
    sykefraversprosent: "Sykefraværsprosent",
} as const;

export type stateUpdater = (value: string) => void;

interface FiltervisningProps {
    filterverdier: Filterverdier;
    oppdaterSøkeverdier: (søkeverdier: Søkeverdier) => void;
    søkPåNytt: () => void;
    className?: string;
}

const Søkeknapp = styled(Button)`
    width: 10rem;
    margin-left: auto;
`;

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
    className,
}: FiltervisningProps) => {
    const [valgtFylke, setValgtFylke] = useState<Fylke>();
    const [valgtKommuner, setValgtKommuner] = useState<Kommune[]>([]);
    const [næringsGrupper, setNæringsGrupper] = useState<Næringsgruppe[]>([]);
    const [sykefraværsProsent, setSykefraværsprosent] = useState<Range>({
        fra: 0,
        til: 100,
    });
    const [antallAnsatte, setAntallAnsatte] = useState<Range>({
        fra: 5,
        til: NaN,
    });
    const [IAStatus, setIAStatus] = useState<IAProsessStatusType>();
    const [sorteringsverdi, setSorteringsverdi] =
        useState<Sorteringsverdi>("tapte_dagsverk");

    const endreFylke = (fylkenummer: string) => {
        if (fylkenummer === valgtFylke?.nummer) return;
        const endretFylke = fylkesnummerTilFylke(
            fylkenummer,
            filterverdier.fylker
        );
        if (!endretFylke) {
            setValgtFylke(undefined);
            oppdaterSøkeverdier({
                fylker: [],
            });
            return;
        }
        setValgtFylke(endretFylke);
        const kommuner = valgtKommuner.filter((k) =>
            k.nummer.startsWith(endretFylke.nummer)
        );
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

    const endreAntallAnsatte = (antallAnsatte: Range) => {
        setAntallAnsatte(antallAnsatte);
        oppdaterSøkeverdier({
            antallAnsatteRange: antallAnsatte,
        });
    };

    const alleKommuner = filterverdier.fylker.flatMap(
        ({ kommuner }) => kommuner
    );
    const relevanteKommuner: GroupedKommune[] = useMemo(() => {
        if (valgtFylke) {
            const kommunerFiltrertPåFylke = filtrerKommunerPåValgtFylke(
                valgtFylke,
                alleKommuner
            );
            return [
                {
                    label: valgtFylke.navn,
                    options: kommunerFiltrertPåFylke,
                },
            ];
        }
        return filterverdier.fylker.map((fylke) => ({
            label: fylke.fylke.navn,
            options: fylke.kommuner,
        }));
    }, [valgtFylke, alleKommuner]);

    return (
        <div className={className}>
            <HorizontalFlexboxDivGap3RemAlignItemsEnd>
                <Fylkedropdown
                    fylkerOgKommuner={filterverdier.fylker}
                    valgtFylke={valgtFylke}
                    endreFylke={endreFylke}
                    style={{ flex: "1" }}
                />
                <Kommunedropdown
                    kommuneGroup={relevanteKommuner}
                    valgtKommuner={valgtKommuner}
                    endreKommuner={endreKommuner}
                    style={{ flex: "5" }}
                />
            </HorizontalFlexboxDivGap3RemAlignItemsEnd>
            <br />
            <Næringsgruppedropdown
                næringsgrupper={filterverdier.neringsgrupper}
                valgtNæringsgruppe={næringsGrupper}
                endreNæringsgrupper={endreNæringsgruppe}
            />
            <br />
            <HorizontalFlexboxDivGap3RemAlignItemsEnd>
                <SykefraværsprosentVelger
                    sykefraværsprosentRange={sykefraværsProsent}
                    endre={(nySykefraværsprosentRange: Range) =>
                        oppdaterSykefraværsprosent(nySykefraværsprosentRange)
                    }
                />
                <AntallAnsatteVelger
                    antallAnsatte={antallAnsatte}
                    endreAntallAnsatte={endreAntallAnsatte}
                />
                <Sorteringsmuligheter
                    valgtSortering={sorteringsverdi}
                    sorteringsMuligheter={filterverdier.sorteringsnokler}
                    endreSortering={(sortering) => {
                        setSorteringsverdi(sortering);
                        oppdaterSøkeverdier({
                            sorteringsnokkel: sortering,
                        });
                    }}
                />
                <IAStatusDropdown
                    endreStatus={(iaStatus) => {
                        setIAStatus(iaStatus);
                        oppdaterSøkeverdier({
                            iaStatus: iaStatus,
                        });
                    }}
                    statuser={filterverdier.statuser}
                    valgtStatus={IAStatus}
                />
                <KunMineVirksomheterToggle onChangeCallback={(visKunMineVirksomheter) =>
                    oppdaterSøkeverdier({ kunMineVirksomheter : visKunMineVirksomheter})
                }/>
                <Søkeknapp
                    size="medium"
                    onClick={() => {
                        søkPåNytt();
                    }}
                >
                    Søk
                </Søkeknapp>
            </HorizontalFlexboxDivGap3RemAlignItemsEnd>
        </div>
    );
};

export interface GroupedKommune {
    label: string;
    options: Kommune[];
}

export const StyledFiltervisning = styled(Filtervisning)`
    ${hvitRammeMedBoxShadow}
    padding: 1rem;
`;
