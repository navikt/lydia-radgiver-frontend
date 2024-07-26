import styled from "styled-components";
import { SideContainer } from "../../styling/containere";
import {
    useHentBrukerinformasjon,
    useHentMineSaker,
} from "../../api/lydia-api";
import { IAProsessStatusType } from "../../domenetyper/domenetyper";
import FiltreringMineSaker from "./Filter/FiltreringMineSaker";
import { useEffect, useMemo, useState } from "react";
import { MineSakerKort } from "./MineSakerKort";
import { NavFarger } from "../../styling/farger";
import { desktopAndUp } from "../../styling/breakpoints";
import { ARKIV_STATUSER } from "./Filter/StatusFilter";
import { Sorteringsknapper } from "./Sorteringsknapper";
import { loggSideLastet } from "../../util/amplitude-klient";
import { loggMineSakerFilterEndringMedAmplitude } from "./loggFilterEndringMedAmplitude";

const FlexContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 2rem;
    width: 100%;

    ${desktopAndUp} {
        flex-direction: row;
        gap: 4rem;
        align-items: flex-start;
    }
`;

const MineSakerListe = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Header1 = styled.h1`
    font-size: 2rem;
    font-weight: 600;
    border-bottom: solid 2px ${NavFarger.gray500};
    margin-bottom: 0;
    padding-bottom: 1rem;
`;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    margin-bottom: 1rem;
`;

const StickyFilterContainer = styled.div`
    position: static;
    top: 1rem;
    min-width: 18rem;

    ${desktopAndUp} {
        position: sticky;
        align-items: flex-start;
    }
`;

export const EIER_FØLGER_FILTER_VALUES = ["eier", "følger"] as const;
export type EierFølgerFilterType = (typeof EIER_FØLGER_FILTER_VALUES)[number][];

export type SøkFilterType = string;

export type SetMinesakerFiltreType = {
    setStatusFilter: (val: IAProsessStatusType[]) => void;
    setSøkFilter: (val: string) => void;
    setEierFølgerFilter: (val: EierFølgerFilterType) => void;
};

export const MinOversiktside = () => {

    useEffect(() => {
        loggSideLastet("Minesakerside")
    }, [])

    // TODO: Loading and error states
    const { data: mineSaker } = useHentMineSaker();
    const { data: brukerInfo } = useHentBrukerinformasjon();

    const [sortBy, setSortBy] = useState<"date" | "alphabetical">("date");
    const [isAscending, setIsAscending] = useState(false);

    const [statusFilter, setStatusFilter] = useState<IAProsessStatusType[]>([]);
    const [eierFølgerFilter, setEierFølgerFilter] =
        useState<EierFølgerFilterType>([]);
    const [søkFilter, setSøkFilter] = useState<SøkFilterType>("");

    const filtretSaker = useMemo(
        () =>
            mineSaker
                ?.filter((sak) =>
                    statusFilter.length
                        ? statusFilter.includes(sak.status)
                        : !ARKIV_STATUSER.includes(sak.status),
                )
                .filter((sak) =>
                    eierFølgerFilter.length
                        ? (sak.eidAv == brukerInfo?.ident &&
                              eierFølgerFilter.includes("eier")) ||
                          (eierFølgerFilter.includes("følger") &&
                              sak.eidAv != brukerInfo?.ident)
                        : true,
                )
                .filter(
                    (sak) =>
                        sak.orgnavn
                            .toLowerCase()
                            .includes(søkFilter.toLowerCase()) ||
                        sak.orgnr
                            .toLowerCase()
                            .includes(søkFilter.toLowerCase()),
                ),
        [mineSaker, statusFilter, eierFølgerFilter, brukerInfo, søkFilter],
    );

    useEffect(() => {
        loggMineSakerFilterEndringMedAmplitude(statusFilter, søkFilter, eierFølgerFilter)
    }, [statusFilter, eierFølgerFilter, søkFilter])

    const sorterteSaker = (() => {
        if (!filtretSaker) return [];

        return [...filtretSaker].sort((a, b) => {
            if (sortBy === "date") {
                const dateA = a.endretTidspunkt.getTime();
                const dateB = b.endretTidspunkt.getTime();
                return isAscending ? dateA - dateB : dateB - dateA;
            } else {
                const navnA = a.orgnavn.toLowerCase();
                const navnB = b.orgnavn.toLowerCase();
                if (navnA < navnB) return isAscending ? -1 : 1;
                if (navnA > navnB) return isAscending ? 1 : -1;
                return 0;
            }
        });
    })();

    const handleSortChange = (
        newSortBy: "date" | "alphabetical",
        newIsAscending: boolean,
    ) => {
        setSortBy(newSortBy);
        setIsAscending(newIsAscending);
    };

    return (
        <SideContainer>
            <HeaderContainer>
                <Header1>
                    Mine saker
                </Header1>
                <Sorteringsknapper onSortChange={handleSortChange} />
            </HeaderContainer>
            <FlexContainer>
                <StickyFilterContainer>
                    <FiltreringMineSaker
                        setFiltre={{
                            setEierFølgerFilter,
                            setStatusFilter,
                            setSøkFilter,
                        }}
                    />
                </StickyFilterContainer>
                <MineSakerListe>
                    {sorterteSaker.length === 0 ? (
                        <div>Fant ingen saker </div>
                    ) : (
                        sorterteSaker.map((sak) => (
                            <MineSakerKort key={sak.saksnummer} sak={sak} />
                        ))
                    )}
                </MineSakerListe>
            </FlexContainer>
        </SideContainer>
    );
};
