import { IAProsessStatusType, IASak } from "../../domenetyper/domenetyper";
import { useNavigate } from "react-router-dom";
import { penskrivSpørreundersøkelseStatus } from "../../components/Badge/SpørreundersøkelseStatusBadge";
import { Button } from "@navikt/ds-react";
import { loggGåTilSakFraMineSaker } from "../../util/amplitude-klient";
import styled from "styled-components";
import { IaSakProsess } from "../../domenetyper/iaSakProsess";
import { lokalDato } from "../../util/dato";
import { useHentSpørreundersøkelser } from "../../api/lydia-api/spørreundersøkelse";
import { useHentPlan } from "../../api/lydia-api/plan";

const Innhold = styled.div`
    background-color: #e6f0ff;
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: row;
    align-items: space-between;
    flex-wrap: wrap;
`;

const CardContentLeft = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;

const ContentText = styled.span`
    font-weight: 600;
`;

const ContentData = styled(ContentText)`
    font-weight: 400;
`;

const CardContentRight = styled.div`
    margin-top: auto;
`;

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

    const { data: behovsvurderinger } =
        useHentSpørreundersøkelser(
            iaSak.orgnr,
            iaSak.saksnummer,
            iaSamarbeid.id,
            "Behovsvurdering",
        );

    const sisteVurdering = behovsvurderinger?.sort(
        (a, b) =>
            (b.endretTidspunkt?.getTime() ?? b.opprettetTidspunkt.getTime()) -
            (a.endretTidspunkt?.getTime() ?? a.opprettetTidspunkt.getTime()),
    )[0];

    const {
        data: evalueringer
    } = useHentSpørreundersøkelser(
        iaSak.orgnr,
        iaSak.saksnummer,
        iaSamarbeid.id,
        "Evaluering",
    );
    const sisteEvaluering = evalueringer?.sort(
        (a, b) =>
            (b.endretTidspunkt?.getTime() ?? b.opprettetTidspunkt.getTime()) -
            (a.endretTidspunkt?.getTime() ?? a.opprettetTidspunkt.getTime()),
    )[0];

    const sistEndretVurdering =
        sisteVurdering?.endretTidspunkt || sisteVurdering?.opprettetTidspunkt;
    const vurderingSistEndret = sistEndretVurdering && lokalDato(sistEndretVurdering);
    const sistEndretEvaluering =
        sisteEvaluering?.endretTidspunkt || sisteEvaluering?.opprettetTidspunkt;
    const evalueringSistEndret = sistEndretEvaluering && lokalDato(sistEndretEvaluering);

    const {
        data: samarbeidsplan,
    } = useHentPlan(iaSak.orgnr, iaSak.saksnummer, iaSamarbeid.id);

    console.log('samarbeidsplan', samarbeidsplan)


    return (
        <Innhold>
            <CardContentLeft>
                {visSpørreundersøkelse && sisteVurdering?.status && vurderingSistEndret ? (
                    <div>
                        <ContentText>Behovsvurdering: </ContentText>
                        <ContentData>
                            {penskrivSpørreundersøkelseStatus(sisteVurdering.status)} {vurderingSistEndret}
                        </ContentData>
                    </div>
                ) : (
                    <div>
                        <ContentText>Sist endret: </ContentText>
                        <ContentData>
                            {lokalDato(
                                iaSak.endretTidspunkt ??
                                iaSak.opprettetTidspunkt,
                            )}
                        </ContentData>
                    </div>
                )}
                {samarbeidsplan && (
                    <div>
                        <ContentText>Plan: </ContentText>
                        <ContentData>
                            Sist endret {lokalDato(samarbeidsplan.sistEndret)}
                        </ContentData>
                    </div>
                )}
                {
                    visSpørreundersøkelse && sisteEvaluering?.status && evalueringSistEndret && (
                        <div>
                            <ContentText>Evaluering: </ContentText>
                            <ContentData>
                                {penskrivSpørreundersøkelseStatus(sisteEvaluering.status)} {evalueringSistEndret}
                            </ContentData>
                        </div>
                    )
                }
            </CardContentLeft>
            <CardContentRight>
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
            </CardContentRight>
        </Innhold>
    );
};
