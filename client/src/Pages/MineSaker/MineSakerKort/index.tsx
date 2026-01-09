import styles from './minesakerkort.module.scss';
import { IAProsessStatusBadge } from "../../../components/Badge/IAProsessStatusBadge";
import { Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { EksternLenke } from "../../../components/EksternLenke";
import { useHentSalesforceUrl } from "../../../api/lydia-api/virksomhet";
import { NavIdentMedLenke } from "../../../components/NavIdentMedLenke";
import { NotePencilIcon } from "@navikt/aksel-icons";
import { useState } from "react";
import { TeamModal } from "../TeamModal";
import { IAProsessStatusType, IASak } from "../../../domenetyper/domenetyper";
import { loggGåTilSakFraMineSaker } from "../../../util/analytics-klient";
import { SamarbeidsKort } from "./SamarbeidsKort";
import { useHentTeam } from "../../../api/lydia-api/team";
import { useHentSamarbeid } from "../../../api/lydia-api/spørreundersøkelse";
import { InternLenke } from "../../../components/InternLenke";

export const MineSakerKort = ({
    iaSak,
    orgnavn,
}: {
    iaSak: IASak;
    orgnavn: string;
}) => {
    const navFane = (status: IAProsessStatusType) => {
        if (status === "IKKE_AKTUELL" || status === "AVBRUTT" || status === "FULLFØRT") {
            return "?fane=historikk";
        }

        return "";
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
            <VStack className={styles.sakskort}>
                <div className={styles.kortHeader}>
                    <Heading level="3" size="medium">
                        <InternLenke
                            className={styles.headerlenke}
                            href={gåTilSakUrl}
                            onClick={() =>
                                loggGåTilSakFraMineSaker(
                                    "virksomhetslenke",
                                    gåTilSakUrl,
                                )
                            }
                        >
                            {orgnavn}
                        </InternLenke>
                        <span className={styles.subheader}> - {iaSak.orgnr}</span>
                    </Heading>
                    <HStack justify={"space-between"} align={"center"}>
                        <HStack gap={"4"} align={"center"}>
                            <IAProsessStatusBadge status={iaSak.status} />
                            <span className={styles.eiertekst}>
                                <b>Eier</b>
                                {iaSak.eidAv ? (
                                    <NavIdentMedLenke navIdent={iaSak.eidAv} />
                                ) : (
                                    <span>Ingen eier</span>
                                )}
                            </span>

                            <Button
                                className={styles.teamModalButton}
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
                            </Button>
                            <TeamModal
                                open={isModalOpen}
                                setOpen={setIsModalOpen}
                                iaSak={iaSak}
                                erPåMineSaker
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
                </div>

                {alleSamarbeid && alleSamarbeid.length > 0 && (
                    <>
                        <div className={styles.skillelinje} />
                        <SamarbeidsKort
                            iaSak={iaSak}
                            alleSamarbeid={alleSamarbeid}
                        />
                    </>
                )}
            </VStack>
        )
    );
};
