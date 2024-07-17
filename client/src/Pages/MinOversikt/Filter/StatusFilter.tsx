import { Accordion, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { useState } from "react";
import { IAProsessStatusType } from "../../../domenetyper/domenetyper";
import { useFilterverdier, useHentMineSaker } from "../../../api/lydia-api";
import { penskrivIAStatus } from "../../../components/Badge/StatusBadge";
import styled from "styled-components";
import { BorderRadius } from "../../../styling/borderRadius";

const StyledAccordion = styled(Accordion)`
    box-shadow: none;
    --__ac-accordion-header-shadow-color: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const StyledAccordionHeader = styled(Accordion.Header)`
    flex-direction: row-reverse;
    & > .navds-accordion__header-content {
        font-size: 1.1rem;
        font-weight: 400;
        flex: 1;
        padding-left: 1rem;
    }
`;
const StyledAccordionItem = styled(Accordion.Item)`
    background-color: white;
    border-radius: 0.25rem;

    & > button:hover {
        border-radius: 0.25rem;
        background-color: white;
    }
`;
const AccordionTitle = styled.div`
    font-weight: 600;
    margin-bottom: 0.5rem;
`;

const CheckboxgroupStyling = styled.div`
    background-color: white;
    padding: 0.5rem 2rem;
    border-radius: ${BorderRadius.medium};
`;

const ARKIV_STATUSER: IAProsessStatusType[] = [
    "FULLFØRT",
    "IKKE_AKTUELL",
    "IKKE_AKTIV",
] as const;

export const StatusFilter = ({
    filterStatusEndring,
}: {
    filterStatusEndring: (val: IAProsessStatusType[]) => void;
}) => {
    const { data: filterVerdier } = useFilterverdier();
    const { data: mineSaker } = useHentMineSaker();

    const [aktiveStatusFiltre, setAktiveStatusFiltre] = useState<
        IAProsessStatusType[]
    >([]);
    const [arkivStatusFilter, setArkivStatusFilter] = useState<string[]>([]);

    const handleStatusFilterEndring = (
        statuser: IAProsessStatusType[],
        arkiv: boolean,
    ) => {
        if (arkiv) {
            //setAktiveStatusFiltre([])
            filterStatusEndring(
                !arkivStatusFilter.length
                    ? [...ARKIV_STATUSER]
                    : [...aktiveStatusFiltre],
            );
            setArkivStatusFilter(statuser);
        } else {
            setAktiveStatusFiltre(statuser);
            filterStatusEndring(statuser);
            setArkivStatusFilter([]);
        }
    };

    return (
        <>
            <div>
                <AccordionTitle>Filtrer søk</AccordionTitle>
                <StyledAccordion variant="default">
                    <StyledAccordionItem defaultOpen>
                        <StyledAccordionHeader>Status</StyledAccordionHeader>
                        <Accordion.Content>
                            <CheckboxGroup
                                legend="status"
                                hideLegend
                                onChange={(val) =>
                                    handleStatusFilterEndring(val, false)
                                }
                                value={aktiveStatusFiltre}
                                disabled={!!arkivStatusFilter.length}
                            >
                                {mineSaker &&
                                    filterVerdier?.statuser
                                        .filter(
                                            (f) => !ARKIV_STATUSER.includes(f),
                                        )
                                        .map((valg) => (
                                            <Checkbox key={valg} value={valg}>
                                                {`${penskrivIAStatus(valg)} (${mineSaker.filter((sak) => sak.status == valg).length})`}
                                            </Checkbox>
                                        ))}
                            </CheckboxGroup>
                        </Accordion.Content>
                    </StyledAccordionItem>
                </StyledAccordion>
            </div>
            <CheckboxgroupStyling>
                <CheckboxGroup
                    legend="Vis arkiverte saker"
                    hideLegend
                    onChange={(val) => handleStatusFilterEndring(val, true)}
                    value={arkivStatusFilter}
                >
                    <Checkbox value={"Arkiv"}>{`Arkiverte saker`}</Checkbox>
                </CheckboxGroup>
            </CheckboxgroupStyling>
        </>
    );
};
