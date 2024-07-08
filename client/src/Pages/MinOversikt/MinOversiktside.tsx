import styled from "styled-components";
import { SideContainer } from "../../styling/containere";
import { useHentMineSaker } from "../../api/lydia-api";
import { IAProsessStatusType } from "../../domenetyper/domenetyper";
import FiltreringMineSaker from "./FiltreringMineSaker";
import { useState } from "react";
import { MineSakerKort } from "./MineSakerKort";
import { Button } from "@navikt/ds-react";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowsUpDownIcon,
} from "@navikt/aksel-icons";
import { NavFarger } from "../../styling/farger";

const FlexContainer = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 5rem;
    width: 100%;
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
`;

export const MinOversiktside = () => {
    const { data: mineSaker, loading, error } = useHentMineSaker();

    const [aktiveStatusFilter, setAktiveStatuser] = useState<
        IAProsessStatusType[]
    >([]);

    const [søkFilter, setSøkFilter] = useState("");

    const [sortByNewest, setSortByNewest] = useState(false);
    const [iconState, setIconState] = useState("initial"); // State for icon toggle

   

    // TODO: error states
    if (loading) return <div>Laster</div>;
    if (error) return <div>feil :trist:</div>;

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
            aktiveStatusFilter.length
                ? aktiveStatusFilter.includes(sak.status)
                : true,
        )
        .filter((sak) =>
            sak.orgnavn.toLowerCase().includes(søkFilter.toLowerCase()),
        );

    const aktiveSaker = filtretSaker?.filter((sak) =>
        aktiveStatuser.includes(sak.status),
    );
    const fullførteSaker = filtretSaker?.filter(
        (sak) => !aktiveStatuser.includes(sak.status),
    );

    const filterStatusEndring = (val: IAProsessStatusType[]) => {
        setAktiveStatuser(val);
    };

    const filterSøkEndring = (søkestreng: string) => {
        setSøkFilter(søkestreng);
    };

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
            <Header1 style={{ borderBottom: `solid 2px ${NavFarger.gray500}` }}>
                Mine saker
            </Header1>
            <Button
                size="small"
                variant="tertiary"
                state="defult"
                label="Nyeste øverst"
                iconPosition="right"
                icon={renderIcon()}
                onClick={handleSortToggle}
            >
                Nyeste øverst
            </Button>
            <FlexContainer>
                <div>
                    <FiltreringMineSaker
                        filterStatusEndring={filterStatusEndring}
                        filterSøkEndring={filterSøkEndring}
                    />
                </div>
                <MineSakerListe>
                    {aktiveSaker?.map((sak) => (
                        <MineSakerKort key={sak.saksnummer} sak={sak} />
                    ))}

                    <h2>Arkiverte saker</h2>
                    {fullførteSaker?.map((sak) => (
                        <MineSakerKort key={sak.saksnummer} sak={sak} />
                    ))}
                </MineSakerListe>
            </FlexContainer>
        </SideContainer>
    );
};
