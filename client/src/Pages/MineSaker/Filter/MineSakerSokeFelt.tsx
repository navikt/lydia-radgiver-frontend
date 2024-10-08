import { Search } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useDebounce } from "../../../util/useDebounce";

const SearchContainer = styled.div`
    border-radius: 0.25rem;
`;

export const MineSakerSøkefelt = ({
    setSøkFilter,
}: {
    setSøkFilter: (val: string) => void;
}) => {
    const [søkestreng, setSøkeStreng] = useState("");
    const faktiskSøkestreng = useDebounce(søkestreng, 500);

    useEffect(() => {
        setSøkFilter(faktiskSøkestreng);
    }, [faktiskSøkestreng]);

    return (
        <SearchContainer>
            <Search
                size="medium"
                variant="simple"
                label="Søk i Mine saker"
                placeholder="Org.nr/navn"
                hideLabel={false}
                onChange={setSøkeStreng}
            />
        </SearchContainer>
    );
};
