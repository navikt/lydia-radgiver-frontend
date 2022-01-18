import {Checkbox, Table} from "@navikt/ds-react";
import {useState} from "react";
import {virksomhetsSykefravær} from "./types";
import "./PrioriteringsTabell.css"


const randomHeltall = () => Math.floor(Math.random() * 100);
const randomProsent = () => parseFloat((Math.random() * 100).toFixed(2));

const sykefraværStatistikk: virksomhetsSykefravær[] = [{
    antallArbeidsforhold: randomHeltall(),
    avtalteDagsverk: randomHeltall(),
    bransje: 'Restaurant',
    navn: 'Generasjonsbaren',
    sykefraværIProsent: randomProsent(),
    tapteDagsverk: randomHeltall()
},
    {
        antallArbeidsforhold: randomHeltall(),
        avtalteDagsverk: randomHeltall(),
        bransje: 'Restaurant',
        navn: 'Antibaren',
        sykefraværIProsent: randomProsent(),
        tapteDagsverk: randomHeltall()
    },
    {
        antallArbeidsforhold: randomHeltall(),
        avtalteDagsverk: randomHeltall(),
        bransje: 'Fiske og sanking',
        navn: 'Jæger & Co',
        sykefraværIProsent: randomProsent(),
        tapteDagsverk: randomHeltall()
    }

]

const kolonneNavn = [
    'Bedriftsnavn',
    'Bransje',
    'Sykefravær i %',
    'Antall arbeidsforhold',
    'Avtalte dagsverk',
    'Tapte dagsverk',
    "" // tom for å ikke ha noen legend på checkbox-kolonnen
]

const useToggleList = (initialState : string[]) => {
    const [list, setList] = useState(initialState)

    return [
        list,
        (value : string) =>
            setList((list) =>
                list.includes(value)
                    ? list.filter((id) => id !== value)
                    : [...list, value]
            ),
    ]
}

export const PrioriteringsTabell = () => (
    <div className="prioriteringstabell--tabell"><Tabell /></div>
)

const Tabell = () => {
    const [selectedRows, toggleSelectedRow] = useToggleList(
        []
    )

    return (
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
                {sykefraværStatistikk.map((sykefraværStatistikk) => (
                    <Table.Row
                        key={sykefraværStatistikk.navn}
                    >
                        <Table.HeaderCell scope="row">
                            <span id={sykefraværStatistikk.navn}>{sykefraværStatistikk.navn}</span>
                        </Table.HeaderCell>
                        <Table.DataCell>{sykefraværStatistikk.bransje}</Table.DataCell>
                        <Table.DataCell>{sykefraværStatistikk.sykefraværIProsent}</Table.DataCell>
                        <Table.DataCell>{sykefraværStatistikk.antallArbeidsforhold}</Table.DataCell>
                        <Table.DataCell>{sykefraværStatistikk.avtalteDagsverk}</Table.DataCell>
                        <Table.DataCell>{sykefraværStatistikk.tapteDagsverk}</Table.DataCell>
                        <Table.DataCell>
                            <Checkbox
                                hideLabel
                                checked={selectedRows.includes(sykefraværStatistikk.navn)}
                                onChange={() => toggleSelectedRow(sykefraværStatistikk.navn)}
                                aria-labelledby={sykefraværStatistikk.navn}
                            >
                                {"Prioriter virksomhet"}
                            </Checkbox>
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    )
}