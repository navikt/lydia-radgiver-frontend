import styled from "styled-components";
import { SideContainer } from "../../styling/containere";
import { useHentMineSaker } from "../../api/lydia-api";
import { IAProsessStatusType } from "../../domenetyper/domenetyper";
import FiltreringMineSaker from "./FiltreringMineSaker";
import { useState } from "react";
import { MineSakerKort } from "./MineSakerKort";

const FlexContainer = styled.div`
    display: flex;
    align-items: flex-start;
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

export const MinOversiktside = () => {
    const { data: mineSaker, loading, error } = useHentMineSaker();

    const [aktiveStatusFilter, setAktiveStatuser] = useState<
        IAProsessStatusType[]
    >([]);

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

    const filtretSaker = mineSaker?.filter((sak) =>
        aktiveStatusFilter.length
            ? aktiveStatusFilter.includes(sak.status)
            : true,
    );
    const aktiveSaker = filtretSaker?.filter((sak) =>
        aktiveStatuser.includes(sak.status),
    );
    const fullførteSaker = filtretSaker?.filter(
        (sak) => !aktiveStatuser.includes(sak.status),
    );

    const handleChange = (val: IAProsessStatusType[]) => {
        setAktiveStatuser(val);
    };

    console.log(mineSaker);

    return (
        <SideContainer>
            <h1 style={{borderBottom: "solid 1px black"}}>Mine saker</h1>
            <FlexContainer>
                <div>
                    <FiltreringMineSaker onChange={handleChange} />
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
