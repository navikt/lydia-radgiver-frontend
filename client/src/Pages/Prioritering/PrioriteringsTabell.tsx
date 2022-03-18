import {Link, Table} from "@navikt/ds-react";
import "./PrioriteringsTabell.css"
import {SykefraversstatistikkVirksomhet} from "../../domenetyper";
import {StatusBadge} from "./StatusBadge";


const kolonneNavn = [
    'Status',
    'Bedriftsnavn',
    'Sykefravær i %',
    'Antall arbeidsforhold',
    'Tapte dagsverk',
    'Mulige dagsverk',
]


interface Props {
    sykefraværsstatistikk: SykefraversstatistikkVirksomhet[]
}

export const PrioriteringsTabell = ({sykefraværsstatistikk}: Props) => {
    return (
        <div className="prioriteringstabell--tabell">
            <Table zebraStripes>
                <Table.Header>
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
                                <Link href="#">{sykefraværStatistikkVirksomhet.virksomhetsnavn}</Link>
                            </Table.HeaderCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.sykefraversprosent}</Table.DataCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.antallPersoner}</Table.DataCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.tapteDagsverk}</Table.DataCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.muligeDagsverk}</Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    )
}