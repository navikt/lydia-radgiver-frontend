import React from "react";
import styled from "styled-components";
import { SortState, Table } from "@navikt/ds-react";
import { SykefraversstatistikkVirksomhet } from "../../domenetyper";
import { StatusBadge } from "../../components/Badge/StatusBadge";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";
import { lokalDato } from "../../util/dato";
import { formaterMedEnDesimal, formaterSomHeltall, formaterSomProsentMedEnDesimal } from "../../util/tallFormatering";
import { EksternLenke } from "../../components/EksternLenke";
import { SøkeresultatFooter } from "./SøkeresultatFooter";
import { hvitBoksMedSkygge } from "../../styling/containere";

interface Kolonne {
    key: string,
    name: string,
    sortable?: boolean,
    textAlignment: "left" | "right"
}

// \u00AD-tegnet setter et punkt der et ord kan deles om det ikke får plass
// Om ordet blir delt vil det automatisk få en bindestrek på delingspunktet
const kolonner: Kolonne[] = [
    {
        key: "status",
        name: "Status",
        textAlignment: "left"
    },
    {
        key: "endret",
        name: "Endret",
        textAlignment: "left"
    },
    {
        key: "navn",
        name: "Virksomhets\u00ADnavn",
        sortable: true,
        textAlignment: "left"
    },
    {
        key: "sykefraversprosent",
        name: "Syke\u00ADfravær",
        sortable: true,
        textAlignment: "right"
    },
    {
        key: "antall_personer",
        name: "Arbeids\u00ADforhold",
        sortable: true,
        textAlignment: "right"
    },
    {
        key: "tapte_dagsverk",
        name: "Tapte dagsverk",
        sortable: true,
        textAlignment: "right"
    },
    {
        key: "mulige_dagsverk",
        name: "Mulige dagsverk",
        sortable: true,
        textAlignment: "right"
    },
    {
        key: "eier",
        name: "Eier",
        textAlignment: "left"
    },
]

const Container = styled.div`
  width: fit-content;
  ${hvitBoksMedSkygge}
`;

const RightAllignedDataCell = styled(Table.DataCell)`
  text-align: right;
`;

interface Props {
    sykefraværsstatistikk: SykefraversstatistikkVirksomhet[];
    side: number;
    endreSide: (side: number) => void;
    sortering: SortState
    endreSortering: (sortering: SortState) => void
    totaltAntallTreff?: number;
    className?: string;
}

export const PrioriteringsTabell = ({
    sykefraværsstatistikk,
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
                direction: sortering.direction === "descending" ? "ascending" : "descending"
            })
            return;
        }
        endreSortering({
            orderBy: sortKey ?? "tapte_dagsverk",
            direction: "descending"
        })
    }

    return (
        <Container className={className}>
            <Table zebraStripes size={"small"} sort={sortering} onSortChange={onSortChange}>
                <Table.Header className={"table-header"}>
                    <Table.Row>
                        {kolonner.map(({sortable = false, name, key, textAlignment}) => (
                            <Table.ColumnHeader
                                scope="col"
                                key={key}
                                sortable={sortable}
                                sortKey={key}
                                align={textAlignment}
                            >
                                {name}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {sykefraværsstatistikk.map((sykefraværStatistikkVirksomhet) => (
                        <Table.Row key={sykefraværStatistikkVirksomhet.virksomhetsnavn}>
                            <Table.DataCell>
                                <StatusBadge status={sykefraværStatistikkVirksomhet.status} />
                            </Table.DataCell>
                            <Table.DataCell>
                                {sykefraværStatistikkVirksomhet.sistEndret ? lokalDato(sykefraværStatistikkVirksomhet.sistEndret) : ""}
                            </Table.DataCell>
                            <Table.HeaderCell scope="row">
                                <EksternLenke
                                    target={`${sykefraværStatistikkVirksomhet.orgnr}`}
                                    href={`virksomhet/${sykefraværStatistikkVirksomhet.orgnr}`}
                                >
                                    {sykefraværStatistikkVirksomhet.virksomhetsnavn}
                                </EksternLenke>
                            </Table.HeaderCell>
                            <RightAllignedDataCell>
                                {formaterSomProsentMedEnDesimal(sykefraværStatistikkVirksomhet.sykefraversprosent)}
                            </RightAllignedDataCell>
                            <RightAllignedDataCell>
                                {formaterSomHeltall(sykefraværStatistikkVirksomhet.antallPersoner)}
                            </RightAllignedDataCell>
                            <RightAllignedDataCell>
                                {formaterMedEnDesimal(sykefraværStatistikkVirksomhet.tapteDagsverk)}
                            </RightAllignedDataCell>
                            <RightAllignedDataCell>
                                {formaterMedEnDesimal(sykefraværStatistikkVirksomhet.muligeDagsverk)}
                            </RightAllignedDataCell>
                            <Table.DataCell>
                                <NavIdentMedLenke navIdent={sykefraværStatistikkVirksomhet.eidAv} />
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            {!!sykefraværsstatistikk.length &&
                <SøkeresultatFooter side={side} endreSide={endreSide}
                                    antallTreffPåSide={sykefraværsstatistikk.length}
                                    totaltAntallTreff={totaltAntallTreff} />
            }
        </Container>
    )
}
