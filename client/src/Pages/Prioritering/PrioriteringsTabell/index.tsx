import React from "react";
import styled from "styled-components";
import { SortState, Table } from "@navikt/ds-react";
import { IAProsessStatusBadge } from "../../../components/Badge/IAProsessStatusBadge";
import { NavIdentMedLenke } from "../../../components/NavIdentMedLenke";
import {
    formaterSomHeltall,
    formaterSomProsentMedEnDesimal,
} from "../../../util/tallFormatering";
import { SøkeresultatFooter } from "../SøkeresultatFooter";
import { hvitBoksMedSkygge } from "../../../styling/containere";
import { Virksomhetsoversikt } from "../../../domenetyper/virksomhetsoversikt";
import { EndretDataCell } from "../EndretDataCell";
import { ScrollUtTilKantenContainer } from "../../../components/ScrollUtTilKantenContainer/ScrollUtTilKantenContainer";
import Virksomhetsnavncelle from "./Virksomhetsnavncelle";

interface Kolonne {
    key: string;
    name: string;
    sortable?: boolean;
    textAlignment: "left" | "right";
}

// \u00AD-tegnet setter et punkt der et ord kan deles om det ikke får plass
// Om ordet blir delt vil det automatisk få en bindestrek på delingspunktet
const kolonner: Kolonne[] = [
    {
        key: "status",
        name: "Status",
        textAlignment: "left",
    },
    {
        key: "sist_endret",
        name: "Endret",
        sortable: true,
        textAlignment: "left",
    },
    {
        key: "navn",
        name: "Virksomhets\u00ADnavn",
        sortable: true,
        textAlignment: "left",
    },
    {
        key: "antall_personer",
        name: "Arbeids\u00ADforhold",
        sortable: true,
        textAlignment: "right",
    },
    {
        key: "sykefravarsprosent",
        name: "Syke\u00ADfravær",
        sortable: true,
        textAlignment: "right",
    },
    {
        key: "tapte_dagsverk",
        name: "Tapte dagsverk",
        sortable: true,
        textAlignment: "right",
    },
    {
        key: "mulige_dagsverk",
        name: "Mulige dagsverk",
        sortable: true,
        textAlignment: "right",
    },
    {
        key: "eier",
        name: "Eier",
        textAlignment: "left",
    },
];

const Container = styled.div`
    width: fit-content;
    ${hvitBoksMedSkygge}
`;

export const RightAllignedDataCell = styled(Table.DataCell)`
    text-align: right;
`;

interface Props {
    virksomhetsoversiktListe: Virksomhetsoversikt[];
    side: number;
    endreSide: (side: number) => void;
    sortering: SortState;
    endreSortering: (sortering: SortState) => void;
    totaltAntallTreff?: number;
    className?: string;
}

export const PrioriteringsTabell = ({
    virksomhetsoversiktListe,
    className,
    side,
    sortering,
    endreSortering,
    endreSide,
    totaltAntallTreff,
}: Props) => {
    const onSortChange = (sortKey: string | undefined) => {
        if (sortKey == sortering.orderBy) {
            endreSortering({
                orderBy: sortKey ?? "tapte_dagsverk",
                direction:
                    sortering.direction === "descending"
                        ? "ascending"
                        : "descending",
            });
            return;
        }
        endreSortering({
            orderBy: sortKey ?? "tapte_dagsverk",
            direction: "descending",
        });
    };

    return (
        <ScrollUtTilKantenContainer $offsetRight={0} $offsetLeft={0}>
            <Container className={className}>
                <Table
                    zebraStripes
                    size={"small"}
                    sort={sortering}
                    onSortChange={onSortChange}
                >
                    <Table.Header className={"table-header"}>
                        <Table.Row>
                            {kolonner.map(
                                ({
                                    sortable = false,
                                    name,
                                    key,
                                    textAlignment,
                                }) => (
                                    <Table.ColumnHeader
                                        scope="col"
                                        key={key}
                                        sortable={sortable}
                                        sortKey={key}
                                        align={textAlignment}
                                    >
                                        {name}
                                    </Table.ColumnHeader>
                                ),
                            )}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {virksomhetsoversiktListe.map((virksomhetsoversikt) => (
                            <Table.Row
                                key={virksomhetsoversikt.virksomhetsnavn}
                            >
                                <Table.DataCell>
                                    <IAProsessStatusBadge
                                        status={virksomhetsoversikt.status}
                                    />
                                </Table.DataCell>
                                <EndretDataCell
                                    sistEndret={virksomhetsoversikt.sistEndret}
                                />
                                <Virksomhetsnavncelle virksomhetsoversikt={virksomhetsoversikt} />
                                <RightAllignedDataCell>
                                    {formaterSomHeltall(
                                        virksomhetsoversikt.antallPersoner,
                                    )}
                                </RightAllignedDataCell>
                                <RightAllignedDataCell>
                                    {formaterSomProsentMedEnDesimal(
                                        virksomhetsoversikt.sykefraværsprosent,
                                    )}
                                </RightAllignedDataCell>
                                <RightAllignedDataCell>
                                    {formaterSomHeltall(
                                        virksomhetsoversikt.tapteDagsverk,
                                    )}
                                </RightAllignedDataCell>
                                <RightAllignedDataCell>
                                    {formaterSomHeltall(
                                        virksomhetsoversikt.muligeDagsverk,
                                    )}
                                </RightAllignedDataCell>
                                <Table.DataCell>
                                    <NavIdentMedLenke
                                        navIdent={virksomhetsoversikt.eidAv}
                                    />
                                </Table.DataCell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
                {!!virksomhetsoversiktListe.length && (
                    <SøkeresultatFooter
                        side={side}
                        endreSide={endreSide}
                        antallTreffPåSide={virksomhetsoversiktListe.length}
                        totaltAntallTreff={totaltAntallTreff}
                    />
                )}
            </Container>
        </ScrollUtTilKantenContainer>
    );
};
