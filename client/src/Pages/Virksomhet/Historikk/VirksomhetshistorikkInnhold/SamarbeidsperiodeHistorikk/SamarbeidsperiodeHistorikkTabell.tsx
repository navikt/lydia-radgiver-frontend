import { IAProsessStatusBadgeNyHistorikk } from "../../../../../components/Badge/IAProsessStatusBadge";
import { lokalDato } from "../../../../../util/dato";
import { SamarbeidsperiodeHistorikk } from "../../../../../domenetyper/historikk";
import { useMemo } from "react";
import { sortertPå } from "../../../../../util/sortering";
import styles from "./samarbeidsperiodehistorikk.module.scss";
import NavIdentMedFallback from "../../../../../components/NavIdentMedFallback";
import { BodyShort, Table } from "@navikt/ds-react";

interface SamarbeidsperiodeHistorikkTabellProps {
    samarbeidsperiode: SamarbeidsperiodeHistorikk;
}

export const SamarbeidsperiodeHistorikkTabell = ({
    samarbeidsperiode,
}: SamarbeidsperiodeHistorikkTabellProps) => {
    const sorterteHendelser = useMemo(
        () =>
            sortertPå(
                samarbeidsperiode.historikkHendelser,
                (hendelse) => new Date(hendelse.tidspunkt).getTime(),
                true,
            ),
        [samarbeidsperiode.historikkHendelser],
    );

    return (
        <div className={styles.historikkTabellWrapper}>
            <Table
                size="small"
                className={styles.historikkTabell}
                style={{ width: "max-content" }}
            >
                <colgroup>
                    <col />
                    <col />
                    <col style={{ minWidth: "25rem" }} />
                    <col />
                </colgroup>
                <Table.Header className={styles.visuallyHidden}>
                    <Table.Row>
                        <Table.HeaderCell
                            scope="col"
                            className={styles.smalKolonne}
                        >
                            Status
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            scope="col"
                            className={styles.smalKolonne}
                        >
                            Tidspunkt
                        </Table.HeaderCell>
                        <Table.HeaderCell scope="col">
                            Beskrivelse
                        </Table.HeaderCell>
                        <Table.HeaderCell
                            scope="col"
                            className={styles.smalKolonne}
                        >
                            Utført av
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {sorterteHendelser.map((hendelse) => (
                        <Table.Row key={hendelse.hendelse_id}>
                            <Table.DataCell className={styles.smalKolonne}>
                                <IAProsessStatusBadgeNyHistorikk
                                    legacy={hendelse.versjon === "LEGACY"}
                                    status={hendelse.resulterende_status}
                                />
                            </Table.DataCell>
                            <Table.DataCell className={styles.smalKolonne}>
                                {lokalDato(hendelse.tidspunkt)}
                            </Table.DataCell>
                            <Table.DataCell>
                                {!!hendelse.årsak && (
                                    <>
                                        {hendelse.årsak?.begrunnelser
                                            ?.length === 1 && (
                                            <span>
                                                {
                                                    hendelse.årsak
                                                        ?.begrunnelser?.[0]
                                                }
                                            </span>
                                        )}
                                        {(hendelse.årsak?.begrunnelser
                                            ?.length ?? 0) > 1 && (
                                            <>
                                                <span>
                                                    {
                                                        hendelse.årsak
                                                            ?.beskrivelse
                                                    }
                                                </span>
                                                <ul>
                                                    {hendelse.årsak?.begrunnelser?.map(
                                                        (begrunnelse) => (
                                                            <li
                                                                key={
                                                                    begrunnelse
                                                                }
                                                            >
                                                                <BodyShort size="small">
                                                                    {
                                                                        begrunnelse
                                                                    }
                                                                </BodyShort>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </>
                                        )}
                                    </>
                                )}
                                {!hendelse.årsak?.beskrivelse && (
                                    <>
                                        {hendelse.hendelsetype ===
                                            "MIGRERING_TIL_NY_FLYT" && (
                                            <span>Automatisk migrert</span>
                                        )}
                                        {hendelse.hendelsetype ===
                                            "TA_EIERSKAP_I_SAK" && (
                                            <span>Tok eierskap i sak</span>
                                        )}
                                        {hendelse.hendelsetype ===
                                            "ENDRE_PROSESS" && (
                                            <span>
                                                Endret samarbeidsnavspan
                                            </span>
                                        )}
                                        {hendelse.hendelsetype ===
                                            "NY_PROSESS" && (
                                            <span>Nytt samarbeid</span>
                                        )}
                                        {hendelse.hendelsetype ===
                                            "SLETT_PROSESS" && (
                                            <span>Slettet samarbeid</span>
                                        )}
                                        {hendelse.hendelsetype ===
                                            "VIRKSOMHET_AVREGISTRERT" && (
                                            <span>
                                                Virksomheten ble slettet i
                                                Brønnøysundregistrene
                                            </span>
                                        )}
                                        {hendelse.resulterende_status ===
                                            "NY" && <span>Opprettet sak</span>}
                                    </>
                                )}
                            </Table.DataCell>
                            <Table.DataCell className={styles.smalKolonne}>
                                <NavIdentMedFallback
                                    navIdent={hendelse.hendelse_opprettet_av}
                                    navn={hendelse.aktør?.navn}
                                />
                            </Table.DataCell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </div>
    );
};
