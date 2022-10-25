import {
    Filterverdier,
    FylkeMedKommuner,
    IAProsessStatusType,
    Kommune,
    Næringsgruppe,
    Søkeverdier,
} from "../../domenetyper";
import { Button } from "@navikt/ds-react";
import { useState } from "react";
import { Range, SykefraværsprosentVelger } from "./SykefraværsprosentVelger";
import { HorizontalFlexboxDivGap3RemAlignItemsEnd } from "./HorizontalFlexboxDiv";
import { Næringsgruppedropdown } from "./NæringsgruppeDropdown";
import { Fylkedropdown } from "./Fylkedropdown";
import { IAStatusDropdown } from "./IAStatusDropdown";
import styled from "styled-components";
import { hvitRammeMedBoxShadow } from "../../styling/containere";
import { Kommunedropdown } from "./Kommunedropdown";
import { AntallArbeidsforholdVelger } from "./AntallArbeidsforholdVelger";
import { EierDropdown } from "./EierDropdown";

export const sorteringsverdier = {
    tapte_dagsverk: "Tapte dagsverk",
    mulige_dagsverk: "Mulige dagsverk",
    antall_personer: "Antall arbeidsforhold",
    sykefraversprosent: "Sykefraværsprosent",
    navn: "Alfabetisk på navn",
} as const;

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
) => næringsgrupper.filter(({kode}) => næringsgruppeKoder.includes(kode));

const Filtervisning = ({
    filterverdier,
    oppdaterSøkeverdier,
    søkPåNytt,
    className,
}: FiltervisningProps) => {
    const [valgtFylke, setValgtFylke] = useState<FylkeMedKommuner>();
    const [valgteKommuner, setValgteKommuner] = useState<Kommune[]>([]);
    const [næringsGrupper, setNæringsGrupper] = useState<Næringsgruppe[]>([]);
    const [sykefraværsProsent, setSykefraværsprosent] = useState<Range>({
        fra: 0,
        til: 100,
    });
    const [antallArbeidsforhold, setAntallArbeidsforhold] = useState<Range>({
        fra: 5,
        til: NaN,
    });
    const [IAStatus, setIAStatus] = useState<IAProsessStatusType>();

    const endreFylke = (fylkesnummer: string) => {
        if (fylkesnummer === valgtFylke?.fylke.nummer) return;
        const endretFylkeMedKommuner = filterverdier.fylker.find(({fylke}) => fylke.nummer === fylkesnummer)
        if (!endretFylkeMedKommuner) {
            setValgtFylke(undefined);
            oppdaterSøkeverdier({
                fylker: [],
            });
            return;
        }
        setValgtFylke(endretFylkeMedKommuner);
        const kommuner = valgteKommuner.filter((kommune) =>
            endretFylkeMedKommuner.kommuner.includes(kommune)
        );
        setValgteKommuner(kommuner);
        oppdaterSøkeverdier({
            fylker: [endretFylkeMedKommuner.fylke],
            kommuner,
        });
    };
    const endreKommuner = (kommuner: Kommune[]) => {
        setValgteKommuner(kommuner);
        oppdaterSøkeverdier({
            kommuner,
        });
    };
    const endreNæringsgruppe = (næringsgruppeKoder: string[]) => {
        const endretNæringsgrupper = næringsgruppeKoderTilNæringsgrupper(
            næringsgruppeKoder,
            filterverdier.neringsgrupper
        );
        const bransjeprogram = næringsgruppeKoder.filter(v => isNaN(+v))
        setNæringsGrupper(endretNæringsgrupper);
        oppdaterSøkeverdier({
            neringsgrupper: endretNæringsgrupper,
            bransjeprogram
        });
    };

    const oppdaterSykefraværsprosent = (sykefraværsprosentRange: Range) => {
        setSykefraværsprosent(sykefraværsprosentRange);
        oppdaterSøkeverdier({
            sykefraversprosentRange: sykefraværsprosentRange,
        });
    };

    const endreAntallArbeidsforhold = (antallArbeidsforhold: Range) => {
        setAntallArbeidsforhold(antallArbeidsforhold);
        oppdaterSøkeverdier({
            antallArbeidsforholdRange: antallArbeidsforhold,
        });
    };

    return (
        <div className={className}>
            <HorizontalFlexboxDivGap3RemAlignItemsEnd>
                <Fylkedropdown
                    fylkerOgKommuner={filterverdier.fylker}
                    valgtFylke={valgtFylke?.fylke}
                    endreFylke={endreFylke}
                    style={{flex: "1"}}
                />
                <Kommunedropdown
                    relevanteFylkerMedKommuner={valgtFylke ? [valgtFylke] : filterverdier.fylker}
                    valgteKommuner={valgteKommuner}
                    endreKommuner={endreKommuner}
                    style={{flex: "5"}}
                />
            </HorizontalFlexboxDivGap3RemAlignItemsEnd>
            <br />
            <Næringsgruppedropdown
                bransjeprogram={filterverdier.bransjeprogram}
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
                <AntallArbeidsforholdVelger
                    antallArbeidsforhold={antallArbeidsforhold}
                    endreAntallArbeidsforhold={endreAntallArbeidsforhold}
                />
            </HorizontalFlexboxDivGap3RemAlignItemsEnd>
            <br />
            <HorizontalFlexboxDivGap3RemAlignItemsEnd>
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
                <EierDropdown
                    filtrerbareEiere={filterverdier.filtrerbareEiere}
                    onEierBytteCallback={(eiere) => {
                        oppdaterSøkeverdier({eiere})
                    }} />
                <Søkeknapp
                    size="medium"
                    onClick={() => {
                        søkPåNytt()
                    }}
                >
                    Søk
                </Søkeknapp>
            </HorizontalFlexboxDivGap3RemAlignItemsEnd>
        </div>
    );
};

export const StyledFiltervisning = styled(Filtervisning)`
  padding: 1rem;
  ${hvitRammeMedBoxShadow}
`;
