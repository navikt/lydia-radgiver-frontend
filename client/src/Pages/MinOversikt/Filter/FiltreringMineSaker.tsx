import styled from "styled-components";
import { SokeFelt } from "./SokeFelt";
import { StatusFilter } from "./StatusFilter";
import { EierFølgerFilter } from "./EierFølgerFilter";
import { SetMinesakerFiltreType } from "../MinOversiktside";

const FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 0.25rem;
    gap: 0.5rem;
`;

const ParentContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const FilterTitle = styled.div`
    font-weight: 600;
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
`;

type Props = {
    setFiltre: SetMinesakerFiltreType
}

const FiltreringMineSaker = ({
    setFiltre: {
        setStatusFilter,
        setSøkFilter,
        setEierFølgerFilter
    }
}: Props) => {
    return (
        <ParentContainer>
            <SokeFelt setSøkFilter={setSøkFilter} />
            <div>
                <FilterTitle>Filtrer søk</FilterTitle>
                <FilterContainer>
                    <EierFølgerFilter setEierFølgerFilter={setEierFølgerFilter} />
                    <StatusFilter setStatusFilter={setStatusFilter} />
                </FilterContainer>
            </div>
        </ParentContainer>
    );
};

export default FiltreringMineSaker;
