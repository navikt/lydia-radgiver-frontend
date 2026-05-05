import { Accordion, Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { useState } from "react";
import { useHentMineSaker } from "@/api/lydia-api/sak";
import { penskrivIAStatus } from "@/components/Badge/IAProsessStatusBadge";
import { IAProsessStatusType } from "@/domenetyper/domenetyper";
import styles from "./mineSakerFilter.module.scss";

export const ARKIV_STATUSER: readonly IAProsessStatusType[] = [
    "FULLFØRT",
    "IKKE_AKTUELL",
    "IKKE_AKTIV",
    "SLETTET",
    "AVSLUTTET",
    "VURDERT",
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
    const nyFlytAktivStatuser: IAProsessStatusType[] = ["VURDERES", "AKTIV"];

    return (
        <>
            <Accordion className={styles.filterAccordion} variant="default">
                <Accordion.Item className={styles.filterItem} defaultOpen>
                    <Accordion.Header className={styles.filterHeader}>
                        Status
                    </Accordion.Header>
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
                                nyFlytAktivStatuser.map((valg) => (
                                    <Checkbox key={valg} value={valg}>
                                        {`${penskrivIAStatus(valg)} (${mineSaker.filter((sak) => sak.iaSak.status == valg).length})`}
                                    </Checkbox>
                                ))}
                        </CheckboxGroup>
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>
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
        <div className={styles.aktivStatusFilter}>
            <CheckboxGroup
                legend="Vis arkiverte saker"
                hideLegend
                onChange={(val) => handleStatusFilterEndring(val, true)}
                value={arkivStatusFiltre}
            >
                <Checkbox value={"Arkiv"}>{`Arkiv`}</Checkbox>
            </CheckboxGroup>
        </div>
    );
};
