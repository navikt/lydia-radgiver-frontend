import { BodyShort, Loader, Table } from "@navikt/ds-react";
import { useHentSamarbeidshistorikk } from "../../../../api/lydia-api/nyFlyt";
import {
    SamarbeidshistorikkRad,
    samarbeidshistorikkBeskrivelse,
} from "../../../../domenetyper/samarbeidshistorikk";
import { NavIdentMedLenke } from "../../../../components/NavIdentMedLenke";
import { lokalDato } from "../../../../util/dato";
import styles from "./sykefraværshistorikkinnhold.module.scss";

interface SamarbeidshistorikkTabellProps {
    orgnr: string;
    saksnummer: string;
    samarbeidId: number;
    samarbeidsnavn: string | null;
}

export const SamarbeidshistorikkTabell = ({
    orgnr,
    saksnummer,
    samarbeidId,
    samarbeidsnavn,
}: SamarbeidshistorikkTabellProps) => {
    const {
        data: historikk,
        loading,
        error,
    } = useHentSamarbeidshistorikk(orgnr, saksnummer, samarbeidId);

    if (loading) {
        return <Loader title="Henter historikk for samarbeidet" />;
    }

    if (error) {
        return <BodyShort>Kunne ikke hente historikk for samarbeidet</BodyShort>;
    }

    if (!historikk || historikk.length === 0) {
        return <BodyShort>Ingen historikk på dette samarbeidet</BodyShort>;
    }

    return (
        <Table
            size="small"
            className={styles.historikkTabell}
            aria-label={`Historikk for samarbeidet ${samarbeidsnavn ?? ""}`}
            style={{ width: "100%", tableLayout: "fixed" }}
        >
            <colgroup>
                <col style={{ width: "35%" }} />
                <col style={{ width: "6rem" }} />
                <col />
            </colgroup>
            <Table.Header className={styles.visuallyHidden}>
                <Table.Row>
                    <Table.HeaderCell scope="col">Hendelse</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Tidspunkt</Table.HeaderCell>
                    <Table.HeaderCell scope="col">Utført av</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {historikk.map((rad) => (
                    <Table.Row key={rad.hendelsestype}>
                        <Table.DataCell>{beskrivelse(rad)}</Table.DataCell>
                    <Table.DataCell style={{ whiteSpace: "nowrap" }}>
                        {rad.tidspunkt ? lokalDato(rad.tidspunkt) : ""}
                    </Table.DataCell>
                    <Table.DataCell
                        style={{
                            whiteSpace: "nowrap",
                            paddingLeft: "8rem",
                        }}
                        >
                            {rad.aktor ? (
                                <NavIdentMedLenke
                                    navIdent={rad.aktor.navIdent}
                                />
                            ) : (
                                ""
                            )}
                        </Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

function beskrivelse(rad: SamarbeidshistorikkRad) {
    return samarbeidshistorikkBeskrivelse[rad.hendelsestype];
}
