import { Table } from "@navikt/ds-react";
import { SpørsmålResultat } from "../../domenetyper/spørreundersøkelseResultat";
import styles from "./spørreundersøkelse.module.scss";

export default function TekstligResultatvisning({
    spørsmål,
    farge,
}: {
    spørsmål: SpørsmålResultat;
    farge: string;
}) {
    const totaltAntallSvar = spørsmål.svarListe.reduce(
        (sum, svar) => sum + svar.antallSvar,
        0,
    );
    if (totaltAntallSvar === 0) {
        return (
            <div className={styles.tekstvisning}>Ikke nok svar mottatt.</div>
        );
    }

    return (
        <div className={styles.tekstvisning}>
            <h4 style={{ color: farge }}>{spørsmål.tekst}</h4>
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Svar</Table.HeaderCell>
                        <Table.HeaderCell>Antall svar</Table.HeaderCell>
                        <Table.HeaderCell>Prosent</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {spørsmål.svarListe.map((svar) => (
                        <Table.Row key={svar.id}>
                            <Table.DataCell>{svar.tekst}</Table.DataCell>
                            <Table.DataCell>{svar.antallSvar}</Table.DataCell>
                            <Table.DataCell>
                                {(
                                    (svar.antallSvar / totaltAntallSvar) *
                                    100
                                ).toFixed(2)}
                                %
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
}
