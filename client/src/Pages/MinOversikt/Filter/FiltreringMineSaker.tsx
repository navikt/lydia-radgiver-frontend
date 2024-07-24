import styled from "styled-components";
import { MineSakerSøkefelt } from "./MineSakerSokeFelt";
import {
    StatusFilter,
    ArkivStatusFilter,
    useStatusFilter,
} from "./StatusFilter";
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
    setFiltre: SetMinesakerFiltreType;
};

const FiltreringMineSaker = ({
    setFiltre: { setStatusFilter, setSøkFilter, setEierFølgerFilter },
}: Props) => {
    const { handleStatusFilterEndring, aktiveStatusFiltre, arkivStatusFiltre } =
        useStatusFilter(setStatusFilter);

    return (
        <ParentContainer>
            <MineSakerSøkefelt setSøkFilter={setSøkFilter} />
            <div>
                <FilterTitle>Filter</FilterTitle>
                <FilterContainer>
                    <StatusFilter
                        aktiveStatusFiltre={aktiveStatusFiltre}
                        arkivStatusFiltre={arkivStatusFiltre}
                        handleStatusFilterEndring={handleStatusFilterEndring}
                    />
                    <EierFølgerFilter
                        setEierFølgerFilter={setEierFølgerFilter}
                    />
                    <ArkivStatusFilter
                        arkivStatusFiltre={arkivStatusFiltre}
                        handleStatusFilterEndring={handleStatusFilterEndring}
                    />
                </FilterContainer>
            </div>
        </ParentContainer>
    );
};

export default FiltreringMineSaker;
