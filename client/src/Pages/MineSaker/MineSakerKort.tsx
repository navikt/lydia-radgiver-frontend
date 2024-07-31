import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { StatusBadge } from "../../components/Badge/StatusBadge";
import { Button, HStack } from "@navikt/ds-react";
import { EksternLenke } from "../../components/EksternLenke";
import {
    useHentIaProsesser,
    useHentKartlegginger,
    useHentSalesforceUrl,
    useHentSykefraværsstatistikkForVirksomhetSisteKvartal,
    useHentTeam,
    useHentVirksomhetsstatistikkSiste4Kvartaler,
} from "../../api/lydia-api";
import { NavFarger } from "../../styling/farger";
import { Link } from "react-router-dom";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";
import { NotePencilIcon } from "@navikt/aksel-icons";
import { useState } from "react";
import { TeamModal } from "./TeamModal";
import { formaterSomHeltall } from "../../util/tallFormatering";
import { IAProsessStatusType, IASak } from "../../domenetyper/domenetyper";
import { Chips } from "@navikt/ds-react";
import { erIDev } from "../../components/Dekoratør/Dekoratør";
import { penskrivKartleggingStatus } from "../../components/Badge/KartleggingStatusBadge";
import { loggGåTilSakFraMineSaker } from "../../util/amplitude-klient";

const Card = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 2rem 1.25rem 2rem;
    border-radius: 10px;
    gap: 1rem;
    width: 100%;
`;

const CardHeader = styled.div`
    display: flex;
    flex-direction: column;
    border-bottom: solid 1px ${NavFarger.gray500};
    width: 100%;
    gap: 1rem;
    padding: 0 0 1rem 0;
`;

const HeaderOverskrift = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
    font-size: 1.5rem;
`;

const HeaderVirksomhetLink = styled(Link)`
    color: ${NavFarger.text};
    text-decoration: none;
    font-weight: 600;
    &:hover,
    &:focus {
        text-decoration: underline;
    }
`;

const HeaderSubskrift = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
`;

const SalesforceLinkBox = styled.div`
    flex: 1;
`;

const EierText = styled.span`
    display: flex;
    gap: 0.5rem;
`;

const CardContent = styled.div`
    background-color: #e6f0ff;
    width: 100%;
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: row;
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

const TeamModalButton = styled(Button)`
    & > .navds-label {
        font-size: 1.125rem;
    }
`;

const ProsesserBoks = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
`;

const navFane = (status: IAProsessStatusType) => {
    let toReturn = "?fane=";
    switch (status) {
        case "KARTLEGGES":
            toReturn += "kartlegging";
            break;
        case "VI_BISTÅR":
            toReturn += "ia-tjenester";
            break;
        case "FULLFØRT":
        case "IKKE_AKTUELL":
            toReturn += "historikk";
            break;
        default:
            return "";
    }
    return toReturn;
};

export const MineSakerKort = ({
    iaSak,
    orgnavn,
}: {
    iaSak: IASak;
    orgnavn: string;
}) => {
    const { data: salesforceInfo } = useHentSalesforceUrl(iaSak.orgnr);
    const { data: følgere = [] } = useHentTeam(iaSak.saksnummer);

    const { data: prosesser = [] } = useHentIaProsesser(
        iaSak.orgnr,
        iaSak.saksnummer,
    );

    const [isModalOpen, setIsModalOpen] = useState(false);

    const gåTilSakUrl = `/virksomhet/${iaSak.orgnr}${navFane(iaSak.status)}`;

    const [valgtProsess, setValgtProsess] = useState<number | undefined>();

    return (
        <Card>
            <CardHeader>
                <HeaderOverskrift>
                    <HeaderVirksomhetLink
                        to={gåTilSakUrl}
                        onClick={() =>
                            loggGåTilSakFraMineSaker(
                                "virksomhetslenke",
                                gåTilSakUrl,
                            )
                        }
                    >
                        {orgnavn}
                    </HeaderVirksomhetLink>
                    <span>-</span>
                    <span>{iaSak.orgnr}</span>
                </HeaderOverskrift>
                <HeaderSubskrift>
                    <StatusBadge status={iaSak.status} />
                    <SalesforceLinkBox>
                        <EksternLenke href={salesforceInfo?.url}>
                            Salesforce
                        </EksternLenke>
                    </SalesforceLinkBox>
                    <EierText>
                        <b>Eier</b>
                        {iaSak.eidAv ? (
                            <NavIdentMedLenke navIdent={iaSak.eidAv} />
                        ) : (
                            <span>Ingen eier</span>
                        )}
                    </EierText>

                    <TeamModalButton
                        onClick={() => setIsModalOpen(true)}
                        variant="tertiary-neutral"
                        icon={
                            <NotePencilIcon
                                focusable="true"
                                fontSize={"1.5rem"}
                            />
                        }
                        size="small"
                        iconPosition="right"
                    >
                        <span>Følgere på sak ({følgere.length})</span>
                    </TeamModalButton>
                    <TeamModal
                        open={isModalOpen}
                        setOpen={setIsModalOpen}
                        iaSak={iaSak}
                    />
                </HeaderSubskrift>
            </CardHeader>
            {erIDev && !!prosesser.length && (
                <ProsesserBoks>
                    <HStack gap="10" align="start" justify="start">
                        <Chips>
                            {prosesser.map((prosess, i) => (
                                <Chips.Toggle
                                    key={prosess.id}
                                    selected={i === valgtProsess}
                                    onClick={() => {
                                        if (i === valgtProsess) {
                                            setValgtProsess(undefined);
                                        } else {
                                            setValgtProsess(i);
                                        }
                                    }}
                                >
                                    {prosess.navn || orgnavn}
                                </Chips.Toggle>
                            ))}
                        </Chips>
                    </HStack>
                </ProsesserBoks>
            )}

            {/* Kommenter ut 'true ||' for å toggle på prosess i dev */}
            {(true || !erIDev || valgtProsess !== undefined) && (
                <CardContentBox iaSak={iaSak} gåTilSakUrl={gåTilSakUrl} />
            )}
        </Card>
    );
};

const VIS_VURDERINGSSTATUSER: readonly IAProsessStatusType[] = [
    "VI_BISTÅR",
    "KARTLEGGES",
] as const;

const CardContentBox = ({
    iaSak,
    gåTilSakUrl,
}: {
    iaSak: IASak;
    gåTilSakUrl: string;
}) => {
    const navigate = useNavigate();

    const { data: statsSiste4Kvartaler, loading: lasterSiste4Kvartaler } =
        useHentVirksomhetsstatistikkSiste4Kvartaler(iaSak.orgnr);
    const { data: statsSisteKvartal, loading: lasterSisteKvartal } =
        useHentSykefraværsstatistikkForVirksomhetSisteKvartal(iaSak.orgnr);

    const { data: behovsvurderinger, loading: lasterKartlegginger } =
        useHentKartlegginger(iaSak.orgnr, iaSak.saksnummer);

    const sisteVurdering = behovsvurderinger?.sort(
        (a, b) =>
            (b.endretTidspunkt?.getTime() ?? b.opprettetTidspunkt.getTime()) -
            (a.endretTidspunkt?.getTime() ?? a.opprettetTidspunkt.getTime()),
    )[0];

    const visVurdering = VIS_VURDERINGSSTATUSER.includes(iaSak.status);
    const vurderingSistEndret = (
        sisteVurdering?.endretTidspunkt || sisteVurdering?.opprettetTidspunkt
    )?.toLocaleDateString("no", {
        dateStyle: "short",
    });

    return (
        <CardContent>
            <CardContentLeft>
                <div>
                    <ContentText>Sist endret: </ContentText>
                    <ContentData>
                        {(
                            iaSak.endretTidspunkt ?? iaSak.opprettetTidspunkt
                        ).toLocaleDateString("no", {
                            dateStyle: "short",
                        })}
                    </ContentData>
                </div>
                <div>
                    <ContentText>Arbeidsforhold: </ContentText>
                    <ContentData>
                        {statsSisteKvartal?.antallPersoner || lasterSisteKvartal
                            ? statsSisteKvartal?.antallPersoner
                            : "Ingen data"}
                    </ContentData>{" "}
                </div>
                <div>
                    <ContentText>Sykefravær: </ContentText>
                    <ContentData>
                        {statsSisteKvartal?.sykefraværsprosent
                            ? `${statsSisteKvartal.sykefraværsprosent} % (forrige kvartal)`
                            : !lasterSisteKvartal
                              ? "Ingen data"
                              : null}
                    </ContentData>
                </div>

                {visVurdering ? (
                    <div>
                        <ContentText>Behovsvurdering: </ContentText>
                        <ContentData>
                            {sisteVurdering?.status && vurderingSistEndret
                                ? `${penskrivKartleggingStatus(sisteVurdering.status)}
                                    ${vurderingSistEndret}`
                                : !lasterKartlegginger
                                  ? "Ingen behovsvurderinger"
                                  : null}
                        </ContentData>
                    </div>
                ) : (
                    <div>
                        <ContentText>Tapte dagsverk: </ContentText>
                        <ContentData>
                            {statsSiste4Kvartaler?.tapteDagsverk
                                ? `${formaterSomHeltall(statsSiste4Kvartaler?.tapteDagsverk)} (siste 4 kvartaler)`
                                : !lasterSiste4Kvartaler
                                  ? "Ingen data"
                                  : null}
                        </ContentData>
                    </div>
                )}
            </CardContentLeft>
            <CardContentRight>
                <Button
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        loggGåTilSakFraMineSaker(
                            "gå-til-sak-knapp",
                            gåTilSakUrl,
                        );
                        navigate(gåTilSakUrl);
                    }}
                >
                    Gå til sak
                </Button>
            </CardContentRight>
        </CardContent>
    );
};
