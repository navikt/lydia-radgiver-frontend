import styles from './minesakerkort.module.scss';
import { IAProsessStatusType, IASak } from "../../../domenetyper/domenetyper";
import { useNavigate } from "react-router-dom";
import { penskrivSpørreundersøkelseStatus } from "../../../components/Badge/SpørreundersøkelseStatusBadge";
import { BodyShort, Button } from "@navikt/ds-react";
import { loggGåTilSakFraMineSaker } from "../../../util/amplitude-klient";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import { lokalDato } from "../../../util/dato";
import { useHentSpørreundersøkelser } from "../../../api/lydia-api/spørreundersøkelse";
import { useHentPlan } from "../../../api/lydia-api/plan";

const VIS_VURDERINGSSTATUSER: readonly IAProsessStatusType[] = [
    "VI_BISTÅR",
    "KARTLEGGES",
] as const;

export const SamarbeidsInnhold = ({
    iaSak,
    iaSamarbeid,
}: {
    iaSak: IASak;
    iaSamarbeid: IaSakProsess;
}) => {
    const gåTilSamarbeidUrl = `/virksomhet/${iaSak.orgnr}/sak/${iaSamarbeid.saksnummer}/samarbeid/${iaSamarbeid.id}`;
    const navigate = useNavigate();
    const visSpørreundersøkelse = VIS_VURDERINGSSTATUSER.includes(iaSak.status);

    const { data: behovsvurderinger } = useHentSpørreundersøkelser(
        iaSak.orgnr,
        iaSak.saksnummer,
        iaSamarbeid.id,
        "BEHOVSVURDERING",
    );

    const sisteVurdering = behovsvurderinger?.sort(
        (a, b) =>
            (b.endretTidspunkt?.getTime() ?? b.opprettetTidspunkt.getTime()) -
            (a.endretTidspunkt?.getTime() ?? a.opprettetTidspunkt.getTime()),
    )[0];

    const { data: evalueringer } = useHentSpørreundersøkelser(
        iaSak.orgnr,
        iaSak.saksnummer,
        iaSamarbeid.id,
        "EVALUERING",
    );
    const sisteEvaluering = evalueringer?.sort(
        (a, b) =>
            (b.endretTidspunkt?.getTime() ?? b.opprettetTidspunkt.getTime()) -
            (a.endretTidspunkt?.getTime() ?? a.opprettetTidspunkt.getTime()),
    )[0];

    const sistEndretVurdering =
        sisteVurdering?.endretTidspunkt || sisteVurdering?.opprettetTidspunkt;
    const vurderingSistEndret =
        sistEndretVurdering && lokalDato(sistEndretVurdering);
    const sistEndretEvaluering =
        sisteEvaluering?.endretTidspunkt || sisteEvaluering?.opprettetTidspunkt;
    const evalueringSistEndret =
        sistEndretEvaluering && lokalDato(sistEndretEvaluering);

    const { data: samarbeidsplan } = useHentPlan(
        iaSak.orgnr,
        iaSak.saksnummer,
        iaSamarbeid.id,
    );

    return (
        <div className={styles.samarbeidsinnhold}>
            <div className={styles.cardContentLeft}>
                {visSpørreundersøkelse &&
                    sisteVurdering?.status &&
                    vurderingSistEndret ? (
                    <div>
                        <BodyShort as="span" weight="semibold">Behovsvurdering: </BodyShort>
                        <BodyShort as="span">
                            {penskrivSpørreundersøkelseStatus(
                                sisteVurdering.status,
                            )}{" "}
                            {vurderingSistEndret}
                        </BodyShort>
                    </div>
                ) : (
                    <div>
                        <BodyShort as="span" weight="semibold">Sist endret: </BodyShort>
                        <BodyShort as="span">
                            {lokalDato(
                                iaSak.endretTidspunkt ??
                                iaSak.opprettetTidspunkt,
                            )}
                        </BodyShort>
                    </div>
                )}
                {samarbeidsplan && (
                    <div>
                        <BodyShort as="span" weight="semibold">Samarbeidsplan: </BodyShort>
                        <BodyShort as="span">
                            Sist endret {lokalDato(samarbeidsplan.sistEndret)}
                        </BodyShort>
                    </div>
                )}
                {visSpørreundersøkelse &&
                    sisteEvaluering?.status &&
                    evalueringSistEndret && (
                        <div>
                            <BodyShort as="span" weight="semibold">Evaluering: </BodyShort>
                            <BodyShort as="span">
                                {penskrivSpørreundersøkelseStatus(
                                    sisteEvaluering.status,
                                )}{" "}
                                {evalueringSistEndret}
                            </BodyShort>
                        </div>
                    )}
            </div>
            <div className={styles.cardContentRight}>
                <Button
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        loggGåTilSakFraMineSaker(
                            "gå-til-sak-knapp",
                            gåTilSamarbeidUrl,
                        );
                        navigate(gåTilSamarbeidUrl);
                    }}
                >
                    Gå til samarbeid
                </Button>
            </div>
        </div>
    );
};
