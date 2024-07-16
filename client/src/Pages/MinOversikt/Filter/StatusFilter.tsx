import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { useState } from "react";
import { IAProsessStatusType } from "../../../domenetyper/domenetyper";
import { useFilterverdier, useHentMineSaker } from "../../../api/lydia-api";
import { penskrivIAStatus } from "../../../components/Badge/StatusBadge";

const ARKIV_STATUSER: IAProsessStatusType[] = [
    "FULLFØRT",
    "IKKE_AKTUELL",
    "IKKE_AKTIV",
];

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
            setAktiveStatusFiltre([]);
            filterStatusEndring(
                !arkivStatusFilter.length ? ARKIV_STATUSER : [],
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
            <CheckboxGroup
                legend="Status"
                onChange={(val) => handleStatusFilterEndring(val, false)}
                value={aktiveStatusFiltre}
            >
                {mineSaker &&
                    filterVerdier?.statuser
                        .filter((f) => !ARKIV_STATUSER.includes(f))
                        .map((valg) => (
                            <Checkbox key={valg} value={valg}>
                                {`${penskrivIAStatus(valg)} (${mineSaker.filter((sak) => sak.status == valg).length})`}
                            </Checkbox>
                        ))}
            </CheckboxGroup>
            <CheckboxGroup
                legend="Vis arkiverte saker"
                onChange={(val) => handleStatusFilterEndring(val, true)}
                value={arkivStatusFilter}
            >
                <Checkbox value={"Arkiv"}>{`Arkiverte saker`}</Checkbox>
            </CheckboxGroup>
        </>
    );
};
