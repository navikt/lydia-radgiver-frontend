import { Detail, Table } from "@navikt/ds-react";
import { IAProsessStatusBadge } from "../../../../../components/Badge/IAProsessStatusBadge";
import { lokalDato } from "../../../../../util/dato";
import { StyledTable } from "../../../../../components/StyledTable";
import { ScrollUtTilKantenContainer } from "../../../../../components/ScrollUtTilKantenContainer/ScrollUtTilKantenContainer";
import { SamarbeidsperiodeHistorikk } from "../../../../../domenetyper/historikk";
import { useMemo } from "react";
import { sortertPå } from "../../../../../util/sortering";
import NavIdentMedFallback from "../../../../../components/NavIdentMedFallback";

interface SamarbeidsperiodeHistorikkTabellProps {
    samarbeidsperiode: SamarbeidsperiodeHistorikk;
}

export const SamarbeidsperiodeHistorikkTabell = ({
    samarbeidsperiode,
}: SamarbeidsperiodeHistorikkTabellProps) => {
    const kolonneNavn = ["Status", "Tidspunkt", "Detaljer", "Endret av"];

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
        <>
            <ScrollUtTilKantenContainer
                $offsetLeft={1.5 + 2.75}
                $offsetRight={1.5 + 0.75}
            >
                <StyledTable>
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
                        {sorterteHendelser.map((hendelse, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.DataCell>
                                        <IAProsessStatusBadge
                                            status={
                                                hendelse.resulterende_status
                                            }
                                        />
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {lokalDato(hendelse.tidspunkt)}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        {!!hendelse.årsak && (
                                            <>
                                                <Detail>
                                                    {hendelse.årsak
                                                        ?.beskrivelse ??
                                                        "Begrunnelse"}
                                                </Detail>
                                                <ul>
                                                    {hendelse.årsak?.begrunnelser.map(
                                                        (begrunnelse) => (
                                                            <li
                                                                key={
                                                                    begrunnelse
                                                                }
                                                            >
                                                                <Detail>
                                                                    {
                                                                        begrunnelse
                                                                    }
                                                                </Detail>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </>
                                        )}
                                        {!hendelse.årsak?.beskrivelse && (
                                            <>
                                                {hendelse.hendelsetype ===
                                                    "MIGRERING_TIL_NY_FLYT" && (
                                                    <Detail>
                                                        Automatisk migrert
                                                    </Detail>
                                                )}
                                                {hendelse.hendelsetype ===
                                                    "TA_EIERSKAP_I_SAK" && (
                                                    <Detail>
                                                        Tok eierskap i sak
                                                    </Detail>
                                                )}
                                                {hendelse.hendelsetype ===
                                                    "ENDRE_PROSESS" && (
                                                    <Detail>
                                                        Endret samarbeidsnavn
                                                    </Detail>
                                                )}
                                                {hendelse.hendelsetype ===
                                                    "NY_PROSESS" && (
                                                    <Detail>
                                                        Nytt samarbeid
                                                    </Detail>
                                                )}
                                                {hendelse.hendelsetype ===
                                                    "SLETT_PROSESS" && (
                                                    <Detail>
                                                        Slettet samarbeid
                                                    </Detail>
                                                )}
                                                {hendelse.hendelsetype ===
                                                    "VIRKSOMHET_AVREGISTRERT" && (
                                                    <Detail>
                                                        Virksomheten ble slettet
                                                        i Brønnøysundregistrene
                                                    </Detail>
                                                )}
                                                {hendelse.resulterende_status ===
                                                    "NY" && (
                                                    <Detail>
                                                        Opprettet sak
                                                    </Detail>
                                                )}
                                            </>
                                        )}
                                    </Table.DataCell>
                                    <Table.DataCell>
                                        <NavIdentMedFallback
                                            navIdent={
                                                hendelse.hendelse_opprettet_av
                                            }
                                        />
                                    </Table.DataCell>
                                </Table.Row>
                            );
                        })}
                    </Table.Body>
                </StyledTable>
            </ScrollUtTilKantenContainer>
        </>
    );
};
