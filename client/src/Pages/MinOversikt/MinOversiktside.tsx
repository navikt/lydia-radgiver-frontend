import styled from "styled-components";
import { SideContainer } from "../../styling/containere";
import { useHentMineSaker } from "../../api/lydia-api";
import { useNavigate } from "react-router-dom";
import { Button } from "@navikt/ds-react";
import { StatusBadge } from "../../components/Badge/StatusBadge";
import { IAProsessStatusType } from "../../domenetyper/domenetyper";
import FiltreringCheckbox from "./FiltreringCheckbox";
import { useState } from "react";

const Container = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    margin-top: 1rem;
    padding: 1rem 2rem;
    border-radius: 1rem;
    cursor: pointer;
    gap: 1rem;
    height: 300px;
    width: 100%;
`;

const CardHeader = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    border-bottom: solid 1px black;
    width: 100%;
`;

const FlexContainer = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 10rem;
    margin-left: 0rem;
`;

export const MinOversiktside = () => {
    const { data: mineSaker, loading, error } = useHentMineSaker();

    const [aktiveStatusFilter, setAktiveStatuser] = useState<
        IAProsessStatusType[]
    >([]);
    const navigate = useNavigate();

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
            <FlexContainer>
                <FiltreringCheckbox onChange={handleChange} />
                <div>
                    <h2 style={{ textAlign: "center" }}>Aktive saker</h2>
                    {aktiveSaker?.map((sak) => (
                        <Container
                            onClick={() => navigate(`/virksomhet/${sak.orgnr}`)}
                            key={sak.saksnummer}
                        >
                            <CardHeader>
                                <h3>{sak.orgnavn}</h3>
                                <span>-</span>
                                <span>{sak.orgnr}</span>
                            </CardHeader>
                            <span>{sak.saksnummer}</span>
                            <StatusBadge status={sak.status} />
                            <Button
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/virksomhet/${sak.orgnr}`);
                                }}
                            >
                                Gå til sak
                            </Button>
                        </Container>
                    ))}

                    <h2>Fullførte saker</h2>
                    {fullførteSaker?.map((sak) => (
                        <Container
                            onClick={() => navigate(`/virksomhet/${sak.orgnr}`)}
                            key={sak.saksnummer}
                        >
                            <CardHeader>
                                <h3>{sak.orgnavn}</h3>
                                <span>-</span>
                                <span>{sak.orgnr}</span>
                            </CardHeader>
                            <span>{sak.saksnummer}</span>
                            <StatusBadge status={sak.status} />
                            <Button
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/virksomhet/${sak.orgnr}`);
                                }}
                            >
                                Gå til sak
                            </Button>
                        </Container>
                    ))}
                </div>
            </FlexContainer>
        </SideContainer>
    );
};
