import { Accordion, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { useHentBrukerinformasjon } from "../../../api/lydia-api/bruker";
import { useHentMineSaker } from "../../../api/lydia-api/sak";
import styled from "styled-components";
import {
    EIER_FØLGER_FILTER_VALUES,
    EierFølgerFilterType,
} from "../MineSakerside";
import { ARKIV_STATUSER } from "./StatusFilter";

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
    border-radius: 0.25rem;

    & > button:hover {
        border-radius: 0.25rem;
        background-color: white;
    }
`;

const penskrivEierFølgerMap: Record<
    (typeof EIER_FØLGER_FILTER_VALUES)[number],
    string
> = {
    eier: "Mine eierskap",
    følger: "Saker jeg følger",
};

export const EierFølgerFilter = ({
    setEierFølgerFilter,
}: {
    setEierFølgerFilter: (val: EierFølgerFilterType) => void;
}) => {
    const { data: mineSaker } = useHentMineSaker();
    const { data: brukerInfo } = useHentBrukerinformasjon();

    // vis antall basert på aktive saker
    const aktiveSaker =
        mineSaker?.filter(
            (sak) => !ARKIV_STATUSER.includes(sak.iaSak.status),
        ) ?? [];
    const antallEier = aktiveSaker.filter(
        (sak) => sak.iaSak.eidAv == brukerInfo?.ident,
    ).length;
    const antallFølger = aktiveSaker.filter(
        (sak) => sak.iaSak.eidAv != brukerInfo?.ident,
    ).length;

    return (
        <StyledAccordion>
            <StyledAccordionItem>
                <StyledAccordionHeader>Tilknytning</StyledAccordionHeader>
                <Accordion.Content>
                    <CheckboxGroup
                        legend="status"
                        hideLegend
                        onChange={(val) => setEierFølgerFilter(val)}
                    >
                        {mineSaker &&
                            EIER_FØLGER_FILTER_VALUES.map((valg) => (
                                <Checkbox key={valg} value={valg}>
                                    {`${penskrivEierFølgerMap[valg]} (${valg == "eier" ? antallEier : antallFølger})`}
                                </Checkbox>
                            ))}
                    </CheckboxGroup>
                </Accordion.Content>
            </StyledAccordionItem>
        </StyledAccordion>
    );
};
