import styled from "styled-components";
import { IAProsessStatusBadge } from "../../components/Badge/IAProsessStatusBadge";
import { Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { EksternLenke } from "../../components/EksternLenke";
import { useHentSalesforceUrl } from "../../api/lydia-api/virksomhet";
import { NavFarger } from "../../styling/farger";
import { NavIdentMedLenke } from "../../components/NavIdentMedLenke";
import { NotePencilIcon } from "@navikt/aksel-icons";
import { useState } from "react";
import { TeamModal } from "./TeamModal";
import { IAProsessStatusType, IASak } from "../../domenetyper/domenetyper";
import { loggGåTilSakFraMineSaker } from "../../util/amplitude-klient";
import { SamarbeidsKort } from "./SamarbeidsKort";
import { useHentTeam } from "../../api/lydia-api/team";
import { useHentSamarbeid } from "../../api/lydia-api/spørreundersøkelse";
import { InternLenke } from "../../components/InternLenke";

const SaksKort = styled(VStack)`
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 2rem 1.25rem 2rem;
    border-radius: 10px;
    gap: 1rem;
    width: 100%;
`;

const KortHeader = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    padding: 0 0 1rem 0;
`;

const Skillelinje = styled.div`
    border-bottom: solid 1px ${NavFarger.gray500};
    width: 100%;
`;

const KortSubheading = styled.span`
    font-weight: 400;
`;

const HeaderVirksomhetLenke = styled(InternLenke)`
    color: ${NavFarger.text};
    text-decoration: none;
    font-weight: 600;
    &:hover,
    &:focus {
        text-decoration: underline;
    }
`;

const EierText = styled.span`
    display: flex;
    gap: 0.5rem;
`;

const TeamModalButton = styled(Button)`
    & > .navds-label {
        font-size: 1.125rem;
    }
`;

export const MineSakerKort = ({
    iaSak,
    orgnavn,
}: {
    iaSak: IASak;
    orgnavn: string;
}) => {
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
    const { data: salesforceInfo } = useHentSalesforceUrl(iaSak.orgnr);
    const { data: følgere = [] } = useHentTeam(iaSak.saksnummer);

    const { data: alleSamarbeid } = useHentSamarbeid(
        iaSak.orgnr,
        iaSak.saksnummer,
    );
    const gåTilSakUrl = `/virksomhet/${iaSak.orgnr}${navFane(iaSak.status)}`;

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        alleSamarbeid && (
            <SaksKort>
                <KortHeader>
                    <Heading level="3" size="medium">
                        <HeaderVirksomhetLenke
                            href={gåTilSakUrl}
                            onClick={() =>
                                loggGåTilSakFraMineSaker(
                                    "virksomhetslenke",
                                    gåTilSakUrl,
                                )
                            }
                        >
                            {orgnavn}
                        </HeaderVirksomhetLenke>
                        <KortSubheading> - {iaSak.orgnr}</KortSubheading>
                    </Heading>
                    <HStack justify={"space-between"} align={"center"}>
                        <HStack gap={"4"} align={"center"}>
                            <IAProsessStatusBadge status={iaSak.status} />
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
                                        aria-hidden
                                        fontSize={"1.5rem"}
                                    />
                                }
                                size="small"
                                iconPosition="right"
                            >
                                <span>Følgere ({følgere.length})</span>
                            </TeamModalButton>
                            <TeamModal
                                open={isModalOpen}
                                setOpen={setIsModalOpen}
                                iaSak={iaSak}
                            />
                        </HStack>
                        {
                            salesforceInfo?.url && (
                                <EksternLenke href={salesforceInfo?.url}>
                                    Salesforce
                                </EksternLenke>
                            )
                        }
                    </HStack>
                </KortHeader>

                {alleSamarbeid && alleSamarbeid.length > 0 && (
                    <>
                        <Skillelinje />
                        <SamarbeidsKort
                            iaSak={iaSak}
                            alleSamarbeid={alleSamarbeid}
                        />
                    </>
                )}
            </SaksKort>
        )
    );
};
