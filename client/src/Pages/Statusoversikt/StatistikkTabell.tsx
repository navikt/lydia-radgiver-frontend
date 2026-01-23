import { Button, HStack, Table } from "@navikt/ds-react";
import { IAProsessStatusBadge } from "../../components/Badge/IAProsessStatusBadge";
import { Statusoversikt } from "../../domenetyper/statusoversikt";
import { IAProsessStatusType } from "../../domenetyper/domenetyper";
import {
    createSearchParams,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
import styles from "./statusoversikt.module.scss";

interface Props {
    lederstatistikkListe: Statusoversikt[];
}

export const StatistikkTabell = ({ lederstatistikkListe }: Props) => {
    const navigate = useNavigate();
    const [søkeparametre, setSøkeparametre] = useSearchParams();

    function gåTilSøk(status: IAProsessStatusType) {
        søkeparametre.set("iaStatus", status);
        setSøkeparametre(søkeparametre, { replace: true });
        navigate({
            pathname: "/../prioritering",
            search: createSearchParams(søkeparametre).toString(),
        });
    }

    return (
        <Table className={styles.tabell} size={"small"}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                    <Table.HeaderCell scope="col">
                        Antall bedrifter
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {lederstatistikkListe?.map(({ status, antall }, i) => {
                    return (
                        <Table.Row key={i + status}>
                            <Table.HeaderCell scope="row">
                                <IAProsessStatusBadge status={status} />
                            </Table.HeaderCell>
                            <Table.DataCell>
                                <HStack justify={"space-between"}>
                                    <span>{antall}</span>
                                    <Button
                                        size={"xsmall"}
                                        onClick={() => gåTilSøk(status)}
                                    >
                                        Åpne i søk
                                    </Button>
                                </HStack>
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};
