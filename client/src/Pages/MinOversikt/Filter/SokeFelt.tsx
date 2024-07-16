import { Search } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useDebounce } from "../../../util/useDebounce";

const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;

    border-radius: 0.25rem;
    gap: 1rem;
    top: 1rem;
`;


export const SokeFelt = ({
    filterSøkEndring,
}: {
    filterSøkEndring: (val: string) => void;
}) => {
    const [søkestreng, setSøkeStreng] = useState("");
    const faktiskSøkestreng = useDebounce(søkestreng, 500);

    useEffect(() => {
        filterSøkEndring(faktiskSøkestreng);
    }, [faktiskSøkestreng]);

    return (
        <SearchContainer>
                <Search
                    size="small"
                    label="Søk på virksomheter"
                    hideLabel={false}
                    onChange={setSøkeStreng}
                />
        </SearchContainer>
    );
};
