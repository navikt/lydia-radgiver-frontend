import styled from "styled-components";
import { SideContainer } from "../../styling/containere";
import { useHentMineSaker } from "../../api/lydia-api";
import { useNavigate } from "react-router-dom";
import { Button } from "@navikt/ds-react";
import { StatusBadge } from "../../components/Badge/StatusBadge";

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
`;

const CardHeader = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    border-bottom: solid 1px black;
    width: 100%;
`;

export const MinOversiktside = () => {
    const { data: mineSaker, loading, error } = useHentMineSaker();
    const navigate = useNavigate();

    if (loading) return <div>Laster</div>;
    if (error) return <div>feil :trist:</div>;

    return (
        <SideContainer>
            {mineSaker?.map((sak) => (
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
                        onClick={() => navigate(`/virksomhet/${sak.orgnr}`)}
                    >
                        Gå til sak
                    </Button>
                </Container>
            ))}
        </SideContainer>
    );
};
