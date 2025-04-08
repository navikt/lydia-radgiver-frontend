import { Accordion, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { useState } from "react";
import { IAProsessStatusType } from "../../../domenetyper/domenetyper";
import { useFilterverdier } from "../../../api/lydia-api/sok";
import { useHentMineSaker } from "../../../api/lydia-api/sak";
import { penskrivIAStatus } from "../../../components/Badge/IAProsessStatusBadge";
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
        font-size: 1.125rem;
        font-weight: 400;
        flex: 1;
        padding-left: 1rem;
    }
`;
const StyledAccordionItem = styled(Accordion.Item)`
    background-color: white;
    border-radius: ${BorderRadius.medium};

    & > button:hover {
        border-radius: ${BorderRadius.medium};
        background-color: white;
    }
`;

const CheckboxgroupStyling = styled.div`
    background-color: white;
    padding: 0.125rem 2.75rem;
    border-radius: ${BorderRadius.medium};
`;

export const ARKIV_STATUSER: readonly IAProsessStatusType[] = [
    "FULLFØRT",
    "IKKE_AKTUELL",
    "IKKE_AKTIV",
    "SLETTET",
] as const;

export const useStatusFilter = (
    setStatusFilter: (val: IAProsessStatusType[]) => void,
) => {
    const [aktiveStatusFiltre, setAktiveStatusFiltre] = useState<
        IAProsessStatusType[]
    >([]);

    const [arkivStatusFiltre, setArkivStatusFiltre] = useState<string[]>([]);

    const handleStatusFilterEndring = (
        statuser: IAProsessStatusType[],
        erArkivFilterEndring: boolean,
    ) => {
        if (erArkivFilterEndring) {
            setStatusFilter(
                !arkivStatusFiltre.length
                    ? [...ARKIV_STATUSER]
                    : [...aktiveStatusFiltre],
            );
            setArkivStatusFiltre(statuser);
        } else {
            setAktiveStatusFiltre(statuser);
            setStatusFilter(statuser);
            setArkivStatusFiltre([]);
        }
    };

    return { handleStatusFilterEndring, aktiveStatusFiltre, arkivStatusFiltre };
};

export const StatusFilter = ({
    handleStatusFilterEndring,
    aktiveStatusFiltre,
    arkivStatusFiltre,
}: {
    arkivStatusFiltre: string[];
    aktiveStatusFiltre: IAProsessStatusType[];
    handleStatusFilterEndring: (
        statuser: IAProsessStatusType[],
        erArkivFilterEndring: boolean,
    ) => void;
}) => {
    const { data: mineSaker } = useHentMineSaker();
    const { data: filterVerdier } = useFilterverdier();

    return (
        <>
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
                            disabled={!!arkivStatusFiltre.length}
                        >
                            {mineSaker &&
                                filterVerdier?.statuser
                                    .filter((f) => !ARKIV_STATUSER.includes(f))
                                    .map((valg) => (
                                        <Checkbox key={valg} value={valg}>
                                            {`${penskrivIAStatus(valg)} (${mineSaker.filter((sak) => sak.iaSak.status == valg).length})`}
                                        </Checkbox>
                                    ))}
                        </CheckboxGroup>
                    </Accordion.Content>
                </StyledAccordionItem>
            </StyledAccordion>
        </>
    );
};

export const ArkivStatusFilter = ({
    handleStatusFilterEndring,
    arkivStatusFiltre,
}: {
    arkivStatusFiltre: string[];
    handleStatusFilterEndring: (
        statuser: IAProsessStatusType[],
        erArkivFilterEndring: boolean,
    ) => void;
}) => {
    return (
        <CheckboxgroupStyling>
            <CheckboxGroup
                legend="Vis arkiverte saker"
                hideLegend
                onChange={(val) => handleStatusFilterEndring(val, true)}
                value={arkivStatusFiltre}
            >
                <Checkbox value={"Arkiv"}>{`Se arkiverte saker`}</Checkbox>
            </CheckboxGroup>
        </CheckboxgroupStyling>
    );
};
