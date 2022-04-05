import {Link, Pagination, Table} from "@navikt/ds-react";
import {SykefraversstatistikkVirksomhet} from "../../domenetyper";
import {StatusBadge} from "./StatusBadge";
import styled from "styled-components";
import {hvitRammeMedBoxShadow} from "../../styling/containere";


const kolonneNavn = [
    'Status',
    'Bedriftsnavn',
    'Sykefravær i %',
    'Antall arbeidsforhold',
    'Tapte dagsverk',
    'Mulige dagsverk',
]


interface Props {
    sykefraværsstatistikk: SykefraversstatistikkVirksomhet[];
    side: number,
    endreSide: (side: number) => void
    antallSider: number
    className?: string;
}

const PrioriteringsTabell = ({sykefraværsstatistikk, className, side, antallSider, endreSide}: Props) => {

    return (
        <div className={className}>
            <Table zebraStripes>
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
                                    href={`virksomhet/${sykefraværStatistikkVirksomhet.orgnr}`}>
                                    {sykefraværStatistikkVirksomhet.virksomhetsnavn}
                                </Link>
                            </Table.HeaderCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.sykefraversprosent}</Table.DataCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.antallPersoner}</Table.DataCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.tapteDagsverk}</Table.DataCell>
                            <Table.DataCell>{sykefraværStatistikkVirksomhet.muligeDagsverk}</Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
            {!!sykefraværsstatistikk.length &&
                <Pagination
                    page={side}
                    onPageChange={endreSide}
                    count={antallSider}
                    prevNextTexts
                />
            }
        </div>
    )
}

export const StyledPrioriteringsTabell = styled(PrioriteringsTabell)`
    ${hvitRammeMedBoxShadow}
`
