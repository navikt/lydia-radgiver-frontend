import {Detail, Link, Pagination, SortState, Table} from "@navikt/ds-react";
import {SykefraversstatistikkVirksomhet} from "../../domenetyper";
import {StatusBadge} from "./StatusBadge";
import styled from "styled-components";
import {hvitRammeMedBoxShadow} from "../../styling/containere";
import {ANTALL_RESULTATER_PER_SIDE, totaltAntallResultaterTilAntallSider} from "./Prioriteringsside";
import {NavIdentMedLenke} from "../../components/NavIdentMedLenke";
import {lokalDato} from "../../util/datoFormatering";
import {formaterSomProsentMedEnDesimal, formaterMedEnDesimal} from "../../util/tallFormatering";

interface Kolonne {
    key: string,
    name: string,
    sortable?: boolean,
    textAlignment: "left" | "right"
}

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
        name: "Bedriftsnavn",
        sortable: true,
        textAlignment: "left"
    },
    {
        key: "sykefraversprosent",
        name: "Sykefravær i %",
        sortable: true,
        textAlignment: "right"
    },
    {
        key: "antall_personer",
        name: "Antall arbeidsforhold",
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
        key: "rådgiver",
        name: "Rådgiver",
        textAlignment: "left"
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
        <div className={className}>
            <Table
                zebraStripes size={"small"}
                sort={sortering}
                onSortChange={onSortChange}
            >
                <Table.Header className={"table-header"}>
                    <Table.Row>
                        {kolonner.map(({sortable = false, name, key, textAlignment}) => (
                            <Table.ColumnHeader scope="col" key={key} sortable={sortable} sortKey={key} align={textAlignment}>
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
                            <Table.DataCell style={{textAlign: "right"}}>{formaterSomProsentMedEnDesimal(sykefraværStatistikkVirksomhet.sykefraversprosent)}</Table.DataCell>
                            <Table.DataCell style={{textAlign: "right"}}>{formaterMedEnDesimal(sykefraværStatistikkVirksomhet.antallPersoner)}</Table.DataCell>
                            <Table.DataCell style={{textAlign: "right"}}>{formaterMedEnDesimal(sykefraværStatistikkVirksomhet.tapteDagsverk)}</Table.DataCell>
                            <Table.DataCell style={{textAlign: "right"}}>{formaterMedEnDesimal(sykefraværStatistikkVirksomhet.muligeDagsverk)}</Table.DataCell>
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
