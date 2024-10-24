import styled from "styled-components";
import { Button, HStack, Table } from "@navikt/ds-react";
import { StatusBadge } from "../../components/Badge/StatusBadge";
import { Statusoversikt } from "../../domenetyper/statusoversikt";
import { hvitBoksMedSkygge } from "../../styling/containere";
import { IAProsessStatusType } from "../../domenetyper/domenetyper";
import { erIDev } from "../../components/Dekoratør/Dekoratør";
import {
    createSearchParams,
    useNavigate,
    useSearchParams,
} from "react-router-dom";

const Tabell = styled(Table)`
    ${hvitBoksMedSkygge};
`;

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
            pathname: "/..",
            search: createSearchParams(søkeparametre).toString(),
        });
    }

    return (
        <Tabell size={"small"}>
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
                                <StatusBadge status={status} />
                            </Table.HeaderCell>
                            <Table.DataCell>
                                <HStack justify={"space-between"}>
                                    <span>{antall}</span>
                                    {erIDev && (
                                        <Button
                                            size={"xsmall"}
                                            onClick={() => gåTilSøk(status)}
                                        >
                                            Åpne i søk
                                        </Button>
                                    )}
                                </HStack>
                            </Table.DataCell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Tabell>
    );
};
