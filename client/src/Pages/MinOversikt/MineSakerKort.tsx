import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MineSaker } from "../../domenetyper/mineSaker";
import { StatusBadge } from "../../components/Badge/StatusBadge";
import { Button } from "@navikt/ds-react";
import { EksternLenke } from "../../components/EksternLenke";
import { useHentSalesforceUrl } from "../../api/lydia-api";
import { NavFarger } from "../../styling/farger";
import { Link } from "react-router-dom";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";

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
                        <b>Eier:</b> <NavIdentMedLenke navIdent={sak.eidAv} />
                    </EierText>
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
                        <ContentText>Saksnummer: </ContentText>
                        <ContentData>{sak.saksnummer}</ContentData>
                    </div>
                    <div>
                        <ContentText>Sist endret: </ContentText>
                        <ContentData>
                            {sak.endretTidspunkt.toLocaleDateString("no", {
                                dateStyle: "short",
                            })}
                        </ContentData>
                    </div>
                    <div>
                        <ContentText>Saksnummer: </ContentText>
                        <ContentData>{sak.saksnummer}</ContentData>
                    </div>
                </CardContentLeft>
                <CardContentRight>
                    <Button
                        size="small"
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
