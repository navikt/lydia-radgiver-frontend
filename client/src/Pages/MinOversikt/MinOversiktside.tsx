import styled from "styled-components";
import { SideContainer } from "../../styling/containere";
import {
    useHentBrukerinformasjon,
    useHentMineSaker,
} from "../../api/lydia-api";
import { IAProsessStatusType } from "../../domenetyper/domenetyper";
import FiltreringMineSaker from "./Filter/FiltreringMineSaker";
import { useState } from "react";
import { MineSakerKort } from "./MineSakerKort";
import { Button } from "@navikt/ds-react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowsUpDownIcon,
} from "@navikt/aksel-icons";
import { NavFarger } from "../../styling/farger";
import { desktopAndUp } from "../../styling/breakpoints";

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
    const { data: mineSaker, loading, error } = useHentMineSaker();
    const { data: brukerInfo } = useHentBrukerinformasjon();

    //Filter states
    const [statusFilter, setStatusFilter] = useState<
        IAProsessStatusType[]
    >([]);
    const [eierFølgerFilter, setEierFølgerFilter] =
        useState<EierFølgerFilterType>([]);
    const [søkFilter, setSøkFilter] = useState<SøkFilterType>("");

    //Sorting states
    const [sortByNewest, setSortByNewest] = useState(true);
    const [iconState, setIconState] = useState<
        "initial" | "descending" | "ascending"
    >("initial");

    // TODO: error states
    if (loading) return <div>Laster</div>;
    if (error) return <div>feil :trist:</div>;

    // TODO samkjør med arkivstatuser i ./Filter/StatusFilter
    const aktiveStatuser: IAProsessStatusType[] = [
        "NY",
        "IKKE_AKTIV",
        "VURDERES",
        "KONTAKTES",
        "KARTLEGGES",
        "VI_BISTÅR",
    ];

    const filtretSaker = mineSaker
        ?.filter((sak) =>
            statusFilter.length
                ? statusFilter.includes(sak.status)
                : aktiveStatuser.includes(sak.status),
        )
        ?.filter((sak) =>
            eierFølgerFilter.length
                ? (sak.eidAv == brukerInfo?.ident &&
                      eierFølgerFilter.includes("eier")) ||
                  (eierFølgerFilter.includes("følger") &&
                      sak.eidAv != brukerInfo?.ident)
                : true,
        )
        .filter((sak) =>
            sak.orgnavn.toLowerCase().includes(søkFilter.toLowerCase()),
        );

    const sorterteSaker = filtretSaker?.sort((a, b) => {
        const dateA = a.endretTidspunkt.getTime();
        const dateB = b.endretTidspunkt.getTime();
        return sortByNewest ? dateB - dateA : dateA - dateB;
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
    };

    const renderIcon = () => {
        if (iconState === "initial") {
            return <ArrowsUpDownIcon />;
        } else if (iconState === "descending") {
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
                        icon={renderIcon()}
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
