import { IAProsessStatusBadgeNyHistorikk } from "../../../../../components/Badge/IAProsessStatusBadge";
import { lokalDato } from "../../../../../util/dato";
import { SamarbeidsperiodeHistorikk } from "../../../../../domenetyper/historikk";
import { Fragment, useMemo } from "react";
import { sortertPå } from "../../../../../util/sortering";
import styles from "./samarbeidsperiodehistorikk.module.scss";
import NavIdentMedFallback from "../../../../../components/NavIdentMedFallback";

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
        <>
            <div className={styles.samarbeidsperiodetabell}>
                {sorterteHendelser.map((hendelse) => {
                    return (
                        <Fragment key={hendelse.hendelse_id}>
                            <IAProsessStatusBadgeNyHistorikk
                                legacy={hendelse.versjon === "LEGACY"}
                                status={hendelse.resulterende_status}
                            />
                            <div>
                                {!!hendelse.årsak && (
                                    <>
                                        {hendelse.årsak?.begrunnelser?.length === 1 && (
                                            <span>{hendelse.årsak?.begrunnelser?.[0]}</span>
                                        )}

                                        {(hendelse.årsak?.begrunnelser?.length ?? 0) > 1 && (
                                            <ul className={styles.begrunnelseListe}>
                                                {hendelse.årsak?.begrunnelser?.map((begrunnelse) => (
                                                    <li key={begrunnelse}>
                                                        <span>{begrunnelse}</span>
                                                    </li>
                                                ))}
                                            </ul>
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
                            </div>
                            <span>{lokalDato(hendelse.tidspunkt)}</span>
                            <NavIdentMedFallback
                                navIdent={hendelse.hendelse_opprettet_av}
                            />
                        </Fragment>
                    );
                })}
            </div>
        </>
    );
};
