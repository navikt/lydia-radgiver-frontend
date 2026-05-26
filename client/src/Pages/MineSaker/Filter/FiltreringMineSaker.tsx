import React from "react";
import { MineSakerSøkefelt } from "./MineSakerSokeFelt";
import { EierFølgerFilter } from "./EierFølgerFilter";
import { ARKIV_STATUSER, EierFølgerFilterType } from "../MineSakerside";
import {
    Accordion,
    Box,
    Checkbox,
    CheckboxGroup,
    Switch,
    VStack,
} from "@navikt/ds-react";
import styles from "./mineSakerFilter.module.scss";
import { IAProsessStatusType } from "../../../domenetyper/domenetyper";
import { useHentMineSaker } from "../../../api/lydia-api/sak";
import { penskrivIAStatus } from "../../../components/Badge/IAProsessStatusBadge";

const FiltreringMineSaker = ({
    setStatusFilter,
    setSøkFilter,
    setEierFølgerFilter,
}: {
    setStatusFilter: (val: IAProsessStatusType[]) => void;
    setSøkFilter: (val: string) => void;
    setEierFølgerFilter: (val: EierFølgerFilterType) => void;
}) => {
    const [aktiveStatusFiltre, setAktiveStatusFiltre] = React.useState<
        IAProsessStatusType[]
    >([]);

    const [visArkiv, setVisArkiv] = React.useState(false);

    const handleArkivFilterEndring = (visArkiv: boolean) => {
        if (visArkiv) {
            setStatusFilter([...ARKIV_STATUSER]);
            setVisArkiv(true);
        } else {
            setStatusFilter([...aktiveStatusFiltre]);
            setVisArkiv(false);
        }
    };

    const handleStatusFilterEndring = (statuser: IAProsessStatusType[]) => {
        setAktiveStatusFiltre(statuser);
        setStatusFilter(statuser);
        setVisArkiv(false);
    };
    const { data: mineSaker } = useHentMineSaker();
    const nyFlytAktivStatuser: IAProsessStatusType[] = ["VURDERES", "AKTIV"];

    return (
        <Box
            background="default"
            borderRadius="12"
            borderColor="neutral-subtle"
            borderWidth="1"
            className={styles.mineSakerFilterBox}
        >
            <VStack gap="space-12">
                <Box padding="space-12">
                    <MineSakerSøkefelt setSøkFilter={setSøkFilter} />
                </Box>
                <Accordion className={styles.mineSakerFilterAccordion}>
                    <Accordion.Item defaultOpen>
                        <Accordion.Header>Status</Accordion.Header>
                        <Accordion.Content>
                            <Switch
                                value="Arkiv"
                                checked={visArkiv}
                                onChange={() =>
                                    handleArkivFilterEndring(!visArkiv)
                                }
                            >
                                Vis arkiverte saker
                            </Switch>
                            <CheckboxGroup
                                legend="status"
                                hideLegend
                                onChange={(val) =>
                                    handleStatusFilterEndring(val)
                                }
                                value={aktiveStatusFiltre}
                                disabled={visArkiv}
                            >
                                {mineSaker &&
                                    nyFlytAktivStatuser.map((valg) => (
                                        <Checkbox key={valg} value={valg}>
                                            {`${penskrivIAStatus(valg)} (${mineSaker.filter((sak) => sak.iaSak.status == valg).length})`}
                                        </Checkbox>
                                    ))}
                            </CheckboxGroup>
                        </Accordion.Content>
                    </Accordion.Item>
                    <EierFølgerFilter
                        setEierFølgerFilter={setEierFølgerFilter}
                    />
                </Accordion>
            </VStack>
        </Box>
    );
};

export default FiltreringMineSaker;
