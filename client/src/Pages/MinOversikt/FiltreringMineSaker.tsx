import React from "react";
import { Checkbox, CheckboxGroup, Search } from "@navikt/ds-react"; // Adjust the import path as necessary
import styled from "styled-components";
import {
    IAProsessStatusType,
} from "../../domenetyper/domenetyper";
import { penskrivIAStatus } from "../../components/Badge/StatusBadge";
import { useFilterverdier } from "../../api/lydia-api";

const Container = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    padding: 2rem 3rem;
    border-radius: 0.25rem;
    cursor: pointer;
    gap: 2rem;
    position: sticky;
    top: 1rem;
`;

const SøkeFeltContainer = styled.div`
    
`

interface Props {
    onChange: (val: IAProsessStatusType[]) => void;
}

const FiltreringMineSaker = ({ onChange } : Props) => {
    const { data } = useFilterverdier();

    return (
        <Container>
            <SøkeFeltContainer>
                <Search size="small" label="Søk i virksomheter" hideLabel={false}/>
            </SøkeFeltContainer>

            <CheckboxGroup legend="Status" onChange={onChange}>
                {data?.statuser.map((valg) => (
                    <Checkbox key={valg} value={valg}>
                        {penskrivIAStatus(valg)}
                    </Checkbox>
                ))}
            </CheckboxGroup>
        </Container>
    );
};

export default FiltreringMineSaker;
