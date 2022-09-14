import {Detail, Link, Pagination, SortState, Table} from "@navikt/ds-react";
import {SykefraversstatistikkVirksomhet} from "../../domenetyper";
import {StatusBadge} from "./StatusBadge";
import styled from "styled-components";
import {hvitRammeMedBoxShadow} from "../../styling/containere";
import {ANTALL_RESULTATER_PER_SIDE, totaltAntallResultaterTilAntallSider} from "./Prioriteringsside";
import {NavIdentMedLenke} from "../../components/NavIdentMedLenke";
import {lokalDato} from "../../util/datoFormatering";
import {formaterSomHeltall, formatterMedEnDesimal} from "../../util/tallFormatering";

interface Kolonne {
    key: string,
    sortable?: boolean,
    name: string
}

const kolonner: Kolonne[] = [
    {
        key: "status",
        name: "Status"
    },
    {
        key: "endret",
        name: "Endret"
    },
    {
        key: "navn",
        name: "Bedriftsnavn",
        sortable: true
    },
    {
        key: "sykefraversprosent",
        name: "Sykefravær i %",
        sortable: true
    },
    {
        key: "antall_personer",
        name: "Antall arbeidsforhold",
        sortable: true
    },
    {
        key: "tapte_dagsverk",
        name: "Tapte dagsverk",
        sortable: true
    },
    {
        key: "mulige_dagsverk",
        name: "Mulige dagsverk",
        sortable: true
    },
    {
        key: "rådgiver",
        name: "Rådgiver"
    },
]

interface Props {
    sykefraværsstatistikk: SykefraversstatistikkVirksomhet[];
    side: number;
    endreSide: (side: number) => void;
    sortering: SortState
    endreSortering: (sortering: SortState) => void
    totaltAntallResultaterISøk: number;
    className?: string;
}

const PrioriteringsTabell = ({
                                 sykefraværsstatistikk,
                                 className,
                                 side,
                                 sortering,
                                 endreSortering,
                                 endreSide,
                                 totaltAntallResultaterISøk
                             }: Props) => {
    return (
        <div className={className}>
            <Table
                zebraStripes size={"small"}
                sort={sortering}
                onSortChange={sortKey => {
                    endreSortering({
                        orderBy: sortKey ?? "tapte_dagsverk",
                        direction: sortering.direction === "descending" ? "ascending" : "descending"
                    })
                }}
            >
                <Table.Header className={"table-header"}>
                    <Table.Row>
                        {kolonner.map(({sortable = false, name, key}) => (
                            <Table.ColumnHeader scope="col" key={key} sortable={sortable} sortKey={key}>
                                {name}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {sykefraværsstatistikk.map((sykefraværStatistikkVirksomhet) => (
                        <Table.Row
                            key={sykefraværStatistikkVirksomhet.virksomhetsnavn}
                        >
                            <Table.DataCell><StatusBadge
                                status={sykefraværStatistikkVirksomhet.status}/></Table.DataCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.sistEndret ? lokalDato(sykefraværStatistikkVirksomhet.sistEndret) : ""}</Table.DataCell>
                            <Table.HeaderCell scope="row">
                                <Link
                                    target={`${sykefraværStatistikkVirksomhet.orgnr}`}
                                    href={`virksomhet/${sykefraværStatistikkVirksomhet.orgnr}`}>
                                    {sykefraværStatistikkVirksomhet.virksomhetsnavn}
                                </Link>
                            </Table.HeaderCell>
                            <Table.DataCell>{formatterMedEnDesimal(sykefraværStatistikkVirksomhet.sykefraversprosent)}</Table.DataCell>
                            <Table.DataCell>{formaterSomHeltall(sykefraværStatistikkVirksomhet.antallPersoner)}</Table.DataCell>
                            <Table.DataCell>{formaterSomHeltall(sykefraværStatistikkVirksomhet.tapteDagsverk)}</Table.DataCell>
                            <Table.DataCell>{formaterSomHeltall(sykefraværStatistikkVirksomhet.muligeDagsverk)}</Table.DataCell>
                            <Table.DataCell>
                                <NavIdentMedLenke navIdent={sykefraværStatistikkVirksomhet.eidAv}/>
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            {!!sykefraværsstatistikk.length &&
                <div style={{display: "flex", flexDirection: "row", gap: "10rem"}}>
                    <Pagination
                        page={side}
                        onPageChange={endreSide}
                        count={totaltAntallResultaterTilAntallSider(totaltAntallResultaterISøk)}
                        prevNextTexts
                    />
                    <Detail size={"small"} style={{alignSelf: "center"}}>
                        Viser {(side - 1) * ANTALL_RESULTATER_PER_SIDE + 1}-{Math.min(side * ANTALL_RESULTATER_PER_SIDE, totaltAntallResultaterISøk)} av
                        totalt {totaltAntallResultaterISøk} søkeresultater.
                        Tallene viser offisiell sykefraværsstatistikk for andre kvartal 2022.
                    </Detail>
                </div>
            }
        </div>
    )
}

export const StyledPrioriteringsTabell = styled(PrioriteringsTabell)`
    ${hvitRammeMedBoxShadow}
`
