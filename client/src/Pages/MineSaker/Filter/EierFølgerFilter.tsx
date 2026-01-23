import { Accordion, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { useHentBrukerinformasjon } from "../../../api/lydia-api/bruker";
import { useHentMineSaker } from "../../../api/lydia-api/sak";
import {
    EIER_FØLGER_FILTER_VALUES,
    EierFølgerFilterType,
} from "../MineSakerside";
import { ARKIV_STATUSER } from "./StatusFilter";
import styles from "./mineSakerFilter.module.scss";

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
        <Accordion className={styles.eierFølgerAccordion}>
            <Accordion.Item className={styles.eierFølgerAccordionItem}>
                <Accordion.Header className={styles.eierFølgerAccordionHeader}>
                    Tilknytning
                </Accordion.Header>
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
            </Accordion.Item>
        </Accordion>
    );
};
