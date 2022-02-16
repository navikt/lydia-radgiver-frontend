import {Table} from "@navikt/ds-react";
import "./PrioriteringsTabell.css"
import { SykefraversstatistikkVirksomhet, Sykefraværsstatistikk } from "../../domenetyper";


const kolonneNavn = [
    'Bedriftsnavn',
    'Sykefravær i %',
    'Antall arbeidsforhold',
    'Tapte dagsverk',
    'Mulige dagsverk',
]

export const PrioriteringsTabell = ({ sykefraværsstatistikkVirksomheter } : Sykefraværsstatistikk) => {
    return (
        <div className="prioriteringstabell--tabell">
            <Table zebraStripes>
                <Table.Header>
                    <Table.Row>
                        {kolonneNavn.map((kolonneNavn) => (
                            <Table.HeaderCell scope="col" key={kolonneNavn}>
                                {kolonneNavn}
                            </Table.HeaderCell>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {sykefraværsstatistikkVirksomheter.map((sykefraværStatistikkVirksomhet) => (
                        <Table.Row
                        key={sykefraværStatistikkVirksomhet.virksomhetsnavn}
                        >
                            <Table.HeaderCell scope="row">
                                <span id={sykefraværStatistikkVirksomhet.virksomhetsnavn}>{sykefraværStatistikkVirksomhet.virksomhetsnavn}</span>
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