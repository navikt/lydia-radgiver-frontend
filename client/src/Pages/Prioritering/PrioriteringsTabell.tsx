import {Detail, Link, Pagination, Table} from "@navikt/ds-react";
import {SykefraversstatistikkVirksomhet} from "../../domenetyper";
import {StatusBadge} from "./StatusBadge";
import styled from "styled-components";
import {hvitRammeMedBoxShadow} from "../../styling/containere";
import {ANTALL_RESULTATER_PER_SIDE, totaltAntallResultaterTilAntallSider} from "./Prioriteringsside";


const kolonneNavn = [
    'Status',
    'Bedriftsnavn',
    'Sykefravær i %',
    'Antall arbeidsforhold',
    'Tapte dagsverk',
    'Mulige dagsverk',
    'Rådgiver'
]


interface Props {
    sykefraværsstatistikk: SykefraversstatistikkVirksomhet[];
    side: number;
    endreSide: (side: number) => void;
    totaltAntallResultaterISøk: number;
    className?: string;
}

const PrioriteringsTabell = ({
                                 sykefraværsstatistikk,
                                 className,
                                 side,
                                 endreSide,
                                 totaltAntallResultaterISøk
                             }: Props) => {
    return (
        <div className={className}>
            <Table zebraStripes size={"small"}>
                <Table.Header className={"table-header"}>
                    <Table.Row>
                        {kolonneNavn.map((navn) => (
                            <Table.HeaderCell scope="col" key={navn}>
                                {navn}
                            </Table.HeaderCell>
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
                            <Table.HeaderCell scope="row">
                                <Link
                                    target={`${sykefraværStatistikkVirksomhet.orgnr}`}
                                    href={`virksomhet/${sykefraværStatistikkVirksomhet.orgnr}`}>
                                    {sykefraværStatistikkVirksomhet.virksomhetsnavn}
                                </Link>
                            </Table.HeaderCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.sykefraversprosent}</Table.DataCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.antallPersoner}</Table.DataCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.tapteDagsverk}</Table.DataCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.muligeDagsverk}</Table.DataCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.eidAv}</Table.DataCell>
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
                        Viser {(side - 1) * ANTALL_RESULTATER_PER_SIDE + 1}-{Math.min(side * ANTALL_RESULTATER_PER_SIDE, totaltAntallResultaterISøk)} av totalt {totaltAntallResultaterISøk} søkeresultater.
                        Tallene viser offisiell sykefraværsstatistikk for første kvartal 2022.
                    </Detail>
                </div>
            }
        </div>
    )
}

export const StyledPrioriteringsTabell = styled(PrioriteringsTabell)`
    ${hvitRammeMedBoxShadow}
`
