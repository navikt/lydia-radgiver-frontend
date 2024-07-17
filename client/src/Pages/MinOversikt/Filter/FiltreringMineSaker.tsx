import styled from "styled-components";
import { IAProsessStatusType } from "../../../domenetyper/domenetyper";
import { SokeFelt } from "./SokeFelt";
import { StatusFilter } from "./StatusFilter";

const StatusFilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 0.25rem;
    gap: 2rem;
`;

const ParentContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

type Props = {
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

            <StatusFilterContainer>
                <StatusFilter filterStatusEndring={filterStatusEndring} />
            </StatusFilterContainer>
        </ParentContainer>
    );
};

export default FiltreringMineSaker;
