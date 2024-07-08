import { Checkbox, CheckboxGroup, Search } from "@navikt/ds-react";
import styled from "styled-components";
import { IAProsessStatusType } from "../../domenetyper/domenetyper";
import { penskrivIAStatus } from "../../components/Badge/StatusBadge";
import { useFilterverdier } from "../../api/lydia-api";

const Container = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    padding: 2rem 3rem;
    border-radius: 0.25rem;
    gap: 2rem;
    position: sticky;
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

    // TODO: Debounce søk
    return (
        <Container>
            <SøkeFeltContainer>
                <Search
                    size="small"
                    label="Søk på virksomheter"
                    hideLabel={false}
                    onChange={filterSøkEndring}
                />
            </SøkeFeltContainer>

            <CheckboxGroup legend="Status" onChange={filterStatusEndring}>
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
