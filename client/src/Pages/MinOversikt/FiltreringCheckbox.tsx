import React from "react";
import { Checkbox, CheckboxGroup } from "@navikt/ds-react"; // Adjust the import path as necessary
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
    justify-items: center;
    align-items: center;
    margin-top: 1rem;
    padding: 2rem 3rem;
    border-radius: 1rem;
    cursor: pointer;
    gap: 1rem;
    position: sticky;
    top: 0;
`;

interface Props {
    onChange: (val: IAProsessStatusType[]) => void;
}

const FiltreringCheckbox: React.FC<Props> = ({ onChange }) => {
    const { data } = useFilterverdier();

    return (
        <Container>
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

export default FiltreringCheckbox;
