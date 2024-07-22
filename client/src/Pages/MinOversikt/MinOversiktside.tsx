import styled from "styled-components";
import { SideContainer } from "../../styling/containere";
import {
    useHentBrukerinformasjon,
    useHentMineSaker,
} from "../../api/lydia-api";
import { IAProsessStatusType } from "../../domenetyper/domenetyper";
import FiltreringMineSaker from "./Filter/FiltreringMineSaker";
import { useMemo, useState } from "react";
import { MineSakerKort } from "./MineSakerKort";
import { Button } from "@navikt/ds-react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowsUpDownIcon,
} from "@navikt/aksel-icons";
import { NavFarger } from "../../styling/farger";
import { desktopAndUp } from "../../styling/breakpoints";
import { ARKIV_STATUSER } from "./Filter/StatusFilter";

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
    gap: 1.5rem;
`;

const Header1 = styled.h1`
    font-size: 2rem;
    font-weight: 600;
    border-bottom: solid 2px ${NavFarger.gray500};
    margin-bottom: 0;
`;

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    margin-bottom: 1rem;
`;
const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
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
    // TODO: Loading and error states
    const { data: mineSaker } = useHentMineSaker();
    const { data: brukerInfo } = useHentBrukerinformasjon();

    const [statusFilter, setStatusFilter] = useState<IAProsessStatusType[]>([]);
    const [eierFølgerFilter, setEierFølgerFilter] =
        useState<EierFølgerFilterType>([]);
    const [søkFilter, setSøkFilter] = useState<SøkFilterType>("");

    const [sortByNewest, setSortByNewest] = useState(true);
    const [iconState, setIconState] = useState<
        "initial" | "descending" | "ascending"
    >("initial");

    const [sortAlphByNewest, setSortAlphByNewest] = useState(true);
    const [alphIconState, setAlphIconState] = useState<
        "initial" | "descending" | "ascending"
    >("initial");

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
                .filter((sak) =>
                    sak.orgnavn.toLowerCase().includes(søkFilter.toLowerCase()),
                ),
        [mineSaker, statusFilter, eierFølgerFilter, brukerInfo, søkFilter],
    );

    const sorterteSaker = filtretSaker?.sort((a, b) => {
        const dateA = a.endretTidspunkt.getTime();
        const dateB = b.endretTidspunkt.getTime();

        if (alphIconState === "initial") {
            return sortByNewest ? dateB - dateA : dateA - dateB;
        } else {
            const navnA = a.orgnavn.toLowerCase(); // Use toLowerCase() to make the comparison case-insensitive
            const navnB = b.orgnavn.toLowerCase();

            if (navnA < navnB) {
                return sortAlphByNewest ? -1 : 1;
            }
            if (navnA > navnB) {
                return sortAlphByNewest ? 1 : -1;
            }
            return 0; // names must be equal
        }
    });

    const handleSortToggle = () => {
        setSortByNewest(!sortByNewest);
        setIconState(
            iconState === "initial"
                ? "descending"
                : iconState === "descending"
                  ? "ascending"
                  : "descending",
        );
        setAlphIconState("initial");
    };

    const handleAlphSortToggle = () => {
        setSortAlphByNewest(!sortAlphByNewest);
        setAlphIconState(
            alphIconState === "initial"
                ? "descending"
                : alphIconState === "descending"
                  ? "ascending"
                  : "descending",
        );
        setIconState("initial");
    };

    const renderDateIcon = () => {
        if (iconState === "initial") {
            return <ArrowsUpDownIcon />;
        } else if (iconState === "descending") {
            return <ArrowDownIcon />;
        } else {
            return <ArrowUpIcon />;
        }
    };
    const renderAlphabeticalIcon = () => {
        if (alphIconState === "initial") {
            return <ArrowsUpDownIcon />;
        } else if (alphIconState === "descending") {
            return <ArrowDownIcon />;
        } else {
            return <ArrowUpIcon />;
        }
    };
    return (
        <SideContainer>
            <HeaderContainer>
                <Header1
                    style={{ borderBottom: `solid 2px ${NavFarger.gray500}` }}
                >
                    Mine saker
                </Header1>
                <ButtonContainer>
                    <Button
                        size="small"
                        variant="tertiary"
                        state="defult"
                        label="Nyeste øverst"
                        iconPosition="right"
                        icon={renderAlphabeticalIcon()}
                        onClick={handleAlphSortToggle}
                    >
                        Alfabetisk rekkefølge
                    </Button>
                    <Button
                        size="small"
                        variant="tertiary"
                        state="defult"
                        label="Nyeste øverst"
                        iconPosition="right"
                        icon={renderDateIcon()}
                        onClick={handleSortToggle}
                    >
                        Sist endret
                    </Button>
                </ButtonContainer>
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
                    {sorterteSaker?.map((sak) => (
                        <MineSakerKort key={sak.saksnummer} sak={sak} />
                    ))}
                </MineSakerListe>
            </FlexContainer>
        </SideContainer>
    );
};
