import { Checkbox, CheckboxGroup, Search } from "@navikt/ds-react";
import styled from "styled-components";
import { IAProsessStatusType } from "../../domenetyper/domenetyper";
import { penskrivIAStatus } from "../../components/Badge/StatusBadge";
import { useFilterverdier } from "../../api/lydia-api";
import { useDebounce } from "../../util/useDebounce";
import { useEffect, useState } from "react";

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

const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;

    border-radius: 0.25rem;
    gap: 1rem;
    top: 1rem;
`;



const SøkeFeltContainer = styled.div``;

interface Props {
    filterStatusEndring: (val: IAProsessStatusType[]) => void;
    filterSøkEndring: (val: string) => void;
}

const FiltreringMineSaker = ({
    filterStatusEndring,
    filterSøkEndring,
}: Props) => {
    const { data } = useFilterverdier();
    const [søkestreng, setSøkeStreng] = useState("");
    const faktiskSøkestreng = useDebounce(søkestreng, 500);

    useEffect(() => {
        filterSøkEndring(faktiskSøkestreng);
    }, [faktiskSøkestreng]);

    return (
        <ParentContainer>
            <SearchContainer>
                <SøkeFeltContainer>
                    <Search
                        size="small"
                        label="Søk på virksomheter"
                        hideLabel={false}
                        onChange={setSøkeStreng}
                    />
                </SøkeFeltContainer>
            </SearchContainer>
            
            <StatusContainer>
                <CheckboxGroup legend="Status" onChange={filterStatusEndring}>
                    {data?.statuser.map((valg) => (
                        <Checkbox key={valg} value={valg}>
                            {penskrivIAStatus(valg)}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
            </StatusContainer>
        </ParentContainer>
    );
};

export default FiltreringMineSaker;
