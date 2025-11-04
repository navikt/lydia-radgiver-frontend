import React from "react";
import { Spacer, Tabs } from "@navikt/ds-react";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import { useSearchParams } from "react-router-dom";
import { IaSakProsess } from "../../../domenetyper/iaSakProsess";
import SamarbeidsplanFane from "../Plan/SamarbeidsplanFane";
import { IASak } from "../../../domenetyper/domenetyper";
import EvalueringFane from "./Evaluering/EvalueringFane";
import { BehovsvurderingFane } from "../Kartlegging/BehovsvurderingFane";
import VirksomhetContext from "../VirksomhetContext";
import VirksomhetOgSamarbeidsHeader from "../Virksomhetsoversikt/VirksomhetsinfoHeader/VirksomhetOgSamarbeidsHeader";
import { loggNavigertTilNyTab } from "../../../util/analytics-klient";
import { SamarbeidProvider } from "./SamarbeidContext";
import { EksternLenke } from "../../../components/EksternLenke";
import { useHentSalesforceSamarbeidLenke } from "../../../api/lydia-api/virksomhet";
import styles from "./samarbeid.module.scss";

export const SamarbeidsVisning = ({
    alleSamarbeid,
    iaSak,
    virksomhet,
    gjeldendeProsessId,
    lasterIaSak,
}: {
    alleSamarbeid: IaSakProsess[];
    virksomhet: Virksomhet;
    iaSak: IASak;
    gjeldendeProsessId: number;
    lasterIaSak: boolean;
}) => {
    const gjeldendeSamarbeid = alleSamarbeid.find(
        (samarbeid) => samarbeid.id == gjeldendeProsessId,
    );

    const [searchParams, setSearchParams] = useSearchParams();
    const fane = searchParams.get("fane") ?? "behovsvurdering";
    const spørreundersøkelseId = searchParams.get("kartleggingId");
    const { data: salesforceSamarbeidsLenke } = useHentSalesforceSamarbeidLenke(
        gjeldendeSamarbeid?.id,
    );

    const oppdaterTabISearchParam = (tab: string) => {
        searchParams.set("fane", tab);
        loggNavigertTilNyTab(tab);
        setSearchParams(searchParams, { replace: true });
    };

    React.useEffect(() => {
        if (
            fane !== "behovsvurdering" &&
            fane !== "plan" &&
            fane !== "evaluering" &&
            fane !== "ia-tjenester"
        ) {
            oppdaterTabISearchParam("behovsvurdering");
        }
    }, []);

    if (gjeldendeSamarbeid === undefined) {
        location.href = `/virksomhet/${iaSak.orgnr}`;
        return null;
    }

    return (
        <VirksomhetContext.Provider
            value={{
                virksomhet,
                iaSak,
                lasterIaSak,
                fane,
                setFane: oppdaterTabISearchParam,
                spørreundersøkelseId: spørreundersøkelseId,
            }}
        >
            <SamarbeidProvider samarbeid={gjeldendeSamarbeid}>
                {gjeldendeSamarbeid && (
                    <div className={styles.samarbeidsvisningContainer}>
                        <VirksomhetOgSamarbeidsHeader
                            virksomhet={virksomhet}
                            iaSak={iaSak}
                            gjeldendeSamarbeid={gjeldendeSamarbeid}
                        />
                        <br />
                        <Tabs
                            value={fane}
                            onChange={oppdaterTabISearchParam}
                            defaultValue="behovsvurdering"
                        >
                            <Tabs.List style={{ width: "100%" }}>
                                {iaSak && (
                                    <Tabs.Tab
                                        value="behovsvurdering"
                                        label="Behovsvurdering"
                                    />
                                )}
                                {iaSak && (
                                    <Tabs.Tab
                                        value="plan"
                                        label="Samarbeidsplan"
                                    />
                                )}
                                {iaSak && (
                                    <Tabs.Tab
                                        value="evaluering"
                                        label="Evaluering"
                                    />
                                )}
                                {iaSak && salesforceSamarbeidsLenke && (
                                    <>
                                        <Spacer />
                                        <EksternLenke
                                            href={
                                                salesforceSamarbeidsLenke.salesforceLenke
                                            }
                                        >
                                            Salesforce - samarbeid
                                        </EksternLenke>
                                    </>
                                )}
                            </Tabs.List>
                            <Tabs.Panel
                                className={styles.panel}
                                value="behovsvurdering"
                            >
                                {iaSak && (
                                    <BehovsvurderingFane
                                        iaSak={iaSak}
                                        gjeldendeSamarbeid={gjeldendeSamarbeid}
                                    />
                                )}
                            </Tabs.Panel>
                            <Tabs.Panel className={styles.panel} value="plan">
                                {iaSak && (
                                    <SamarbeidsplanFane
                                        iaSak={iaSak}
                                        samarbeid={gjeldendeSamarbeid}
                                    />
                                )}
                            </Tabs.Panel>
                            <Tabs.Panel
                                className={styles.panel}
                                value="evaluering"
                            >
                                {iaSak && (
                                    <EvalueringFane
                                        iaSak={iaSak}
                                        gjeldendeSamarbeid={gjeldendeSamarbeid}
                                    />
                                )}
                            </Tabs.Panel>
                        </Tabs>
                    </div>
                )}
            </SamarbeidProvider>
        </VirksomhetContext.Provider>
    );
};
