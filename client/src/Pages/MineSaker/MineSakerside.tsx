import styled from "styled-components";
import { SideContainer } from "../../styling/containere";
import { useHentBrukerinformasjon } from "../../api/lydia-api/bruker";
import { useHentMineSaker } from "../../api/lydia-api/sak";
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
    min-width: 18rem;

    ${desktopAndUp} {
        position: sticky;
        align-items: flex-start;
        top: 3rem;
        transform: translateY(-2rem);
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

export const MineSakerside = () => {
    useEffect(() => {
        loggSideLastet("Minesakerside");
    }, []);

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
                        ? statusFilter.includes(sak.iaSak.status)
                        : !ARKIV_STATUSER.includes(sak.iaSak.status),
                )
                .filter((sak) =>
                    eierFølgerFilter.length
                        ? (sak.iaSak.eidAv == brukerInfo?.ident &&
                            eierFølgerFilter.includes("eier")) ||
                        (eierFølgerFilter.includes("følger") &&
                            sak.iaSak.eidAv != brukerInfo?.ident)
                        : true,
                )
                .filter(
                    (sak) =>
                        sak.orgnavn
                            .toLowerCase()
                            .includes(søkFilter.toLowerCase()) ||
                        sak.iaSak.orgnr
                            .toLowerCase()
                            .includes(søkFilter.toLowerCase()),
                ),
        [mineSaker, statusFilter, eierFølgerFilter, brukerInfo, søkFilter],
    );

    useEffect(() => {
        loggMineSakerFilterEndringMedAmplitude(
            statusFilter,
            søkFilter,
            eierFølgerFilter,
        );
    }, [statusFilter, eierFølgerFilter, søkFilter]);

    const sorterteSaker = (() => {
        if (!filtretSaker) return [];

        return [...filtretSaker].sort((a, b) => {
            if (sortBy === "date") {
                const dateA =
                    a.iaSak.endretTidspunkt?.getTime() ??
                    a.iaSak.opprettetTidspunkt.getTime();
                const dateB =
                    b.iaSak.endretTidspunkt?.getTime() ??
                    b.iaSak.opprettetTidspunkt.getTime();
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
                <Header1>Mine saker</Header1>
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
                        sorterteSaker.map((minsak) => (
                            <MineSakerKort
                                key={minsak.iaSak.saksnummer}
                                {...minsak}
                            />
                        ))
                    )}
                </MineSakerListe>
            </FlexContainer>
        </SideContainer>
    );
};
