import styled from "styled-components";
import { IAProsessStatusType } from "../../../domenetyper/domenetyper";
import { SokeFelt } from "./SokeFelt";
import { StatusFilter } from "./StatusFilter";

const StatusContainer = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    padding: 2rem 3rem;
    border-radius: 0.25rem;
    gap: 1rem;
    top: 1rem;
`;

const ParentContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

interface Props {
    filterStatusEndring: (val: IAProsessStatusType[]) => void;
    filterSøkEndring: (val: string) => void;
}

const FiltreringMineSaker = ({
    filterStatusEndring,
    filterSøkEndring,
}: Props) => {
    return (
        <ParentContainer>
            <SokeFelt filterSøkEndring={filterSøkEndring} />

            <StatusContainer>
                <StatusFilter filterStatusEndring={filterStatusEndring} />
            </StatusContainer>
        </ParentContainer>
    );
};

export default FiltreringMineSaker;
