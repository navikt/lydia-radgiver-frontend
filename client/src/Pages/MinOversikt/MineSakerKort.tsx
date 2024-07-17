import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MineSaker } from "../../domenetyper/mineSaker";
import { StatusBadge } from "../../components/Badge/StatusBadge";
import { Button } from "@navikt/ds-react";
import { EksternLenke } from "../../components/EksternLenke";
import {
    useHentSalesforceUrl,
    useHentSykefraværsstatistikkForVirksomhetSisteKvartal,
    useHentTeam,
    useHentVirksomhetsstatistikkSiste4Kvartaler,
} from "../../api/lydia-api";
import { NavFarger } from "../../styling/farger";
import { Link } from "react-router-dom";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";
import { DocPencilIcon } from "@navikt/aksel-icons";
import { useState } from "react";
import { TeamModal } from "./TeamModal";
import { formaterSomHeltall } from "../../util/tallFormatering";
import { erIDev } from "../../components/Dekoratør/Dekoratør";

const Card = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 2rem 1rem 2rem;
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
    font-size: 1.25rem;
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

const SalesforceLink = styled(EksternLenke)`
    font-size: 1rem;
`;

const EierText = styled.span`
    flex: 1;
    text-align: right;
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
    gap: 0.75rem;
`;

const ContentText = styled.span`
    font-size: 1rem;
    font-style: normal;
    font-weight: 600;
`;

const ContentData = styled(ContentText)`
    font-weight: 400;
`;

const CardContentRight = styled.div`
    margin-top: auto;
`;

export const MineSakerKort = ({ sak }: { sak: MineSaker }) => {
    const navigate = useNavigate();
    const { data: salesforceInfo } = useHentSalesforceUrl(sak.orgnr);

    const { data: følgere, mutate } = useHentTeam(sak.saksnummer);

    const { data: statsSiste4Kvartaler, loading } =
        useHentVirksomhetsstatistikkSiste4Kvartaler(sak.orgnr);

    const { data: statsSisteKvartal, loading: lasterSisteKvartal } =
        useHentSykefraværsstatistikkForVirksomhetSisteKvartal(sak.orgnr);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleIconClick = () => {
        setIsModalOpen(true);
    };

    const sakInfo = {
        saksnummer: sak.saksnummer,
        orgnavn: sak.orgnavn,
        orgnummer: sak.orgnr,
        navIdent: sak.eidAv,
        følgere: følgere ?? [],
        mutate,
    };

    return (
        <Card>
            <CardHeader>
                <HeaderOverskrift>
                    <HeaderVirksomhetLink to={`/virksomhet/${sak.orgnr}`}>
                        {sak.orgnavn}
                    </HeaderVirksomhetLink>
                    <span>-</span>
                    <span>{sak.orgnr}</span>
                </HeaderOverskrift>
                <HeaderSubskrift>
                    <StatusBadge status={sak.status} />
                    <SalesforceLink href={salesforceInfo?.url}>
                        Salesforce
                    </SalesforceLink>
                    <EierText>
                        <b>Eier: </b>
                        {sak.eidAv ? (
                            <NavIdentMedLenke navIdent={sak.eidAv} />
                        ) : (
                            "Ingen eier"
                        )}
                    </EierText>
                    {erIDev && (
                        <>
                            <span>Følgere på sak ({følgere?.length})</span>
                            <DocPencilIcon
                                focusable="true"
                                cursor="pointer"
                                onClick={handleIconClick}
                                fontSize={30}
                            />
                            <TeamModal
                                open={isModalOpen}
                                setOpen={setIsModalOpen}
                                sakInfo={sakInfo}
                            />
                        </>
                    )}
                </HeaderSubskrift>
            </CardHeader>
            <CardContent>
                <CardContentLeft>
                    <div>
                        <ContentText>Sist endret: </ContentText>
                        <ContentData>
                            {sak.endretTidspunkt.toLocaleDateString("no", {
                                dateStyle: "short",
                            })}
                        </ContentData>
                    </div>
                    <div>
                        <ContentText>Arbeidsforhold: </ContentText>
                        <ContentData>
                            {statsSisteKvartal?.antallPersoner ||
                            lasterSisteKvartal
                                ? statsSisteKvartal?.antallPersoner
                                : "Ingen data"}
                        </ContentData>{" "}
                    </div>
                    <div>
                        <ContentText>Sykefravær: </ContentText>
                        <ContentData>
                            {statsSisteKvartal?.sykefraværsprosent
                                ? `${statsSisteKvartal?.sykefraværsprosent} %`
                                : !lasterSisteKvartal
                                  ? "Ingen data"
                                  : null}
                        </ContentData>
                    </div>
                    <div>
                        <ContentText>Tapte dagsverk: </ContentText>
                        <ContentData>
                            {statsSiste4Kvartaler?.tapteDagsverk
                                ? formaterSomHeltall(
                                      statsSiste4Kvartaler?.tapteDagsverk,
                                  )
                                : !loading
                                  ? "Ingen data"
                                  : null}
                        </ContentData>
                    </div>
                </CardContentLeft>
                <CardContentRight>
                    <Button
                        size="small"
                        href={`/virksomhet/${sak.orgnr}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/virksomhet/${sak.orgnr}`);
                        }}
                    >
                        Gå til sak
                    </Button>
                </CardContentRight>
            </CardContent>
        </Card>
    );
};
