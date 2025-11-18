import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, HStack, Loader, Tabs, VStack } from "@navikt/ds-react";
import { Virksomhet } from "../../domenetyper/virksomhet";
import { useHentSakForVirksomhet, useHentSalesforceSamarbeidLenke } from "../../api/lydia-api/virksomhet";
import VirksomhetContext from "./VirksomhetContext";
import VirksomhetOgSamarbeidsHeader from "./Virksomhetsoversikt/VirksomhetsinfoHeader/VirksomhetOgSamarbeidsHeader";
import styles from './virksomhetsvisning.module.scss';
import Samarbeidsvelger from "./Samarbeidsvelger";
import { IaSakProsess } from "../../domenetyper/iaSakProsess";
import { useHentSamarbeid } from "../../api/lydia-api/spørreundersøkelse";
import { loggNavigertTilNyTab } from "../../util/analytics-klient";
import { SykefraværsstatistikkFane } from "./Statistikk/SykefraværsstatistikkFane";
import { SakshistorikkFane } from "./Sakshistorikk/SakshistorikkFane";
import { SamarbeidProvider } from "./Samarbeid/SamarbeidContext";
import { EndreSamarbeidModal } from "./Samarbeid/EndreSamarbeidModal";
import { IASak } from "../../domenetyper/domenetyper";
import { EksternLenke } from "../../components/EksternLenke";
import { BehovsvurderingFane } from "./Kartlegging/BehovsvurderingFane";
import SamarbeidsplanFane from "./Plan/SamarbeidsplanFane";
import EvalueringFane from "./Samarbeid/Evaluering/EvalueringFane";
import { SamarbeidStatusBadge } from "../../components/Badge/SamarbeidStatusBadge";

interface Props {
    virksomhet: Virksomhet;
}

export const VirksomhetsVisning = ({ virksomhet }: Props) => {
    const { data: iaSak, loading: lasterIaSak } = useHentSakForVirksomhet(
        virksomhet.orgnr,
        virksomhet.aktivtSaksnummer ?? undefined,
    );
    const { data: alleSamarbeid, loading: lasterSamarbeid, validating: validererSamarbeid } = useHentSamarbeid(iaSak?.orgnr, iaSak?.saksnummer);
    const [searchParams, setSearchParams] = useSearchParams();
    const { /* orgnummer, saksnummer, */ prosessId } = useParams();
    const fane = searchParams.get("fane") ?? "statistikk";

    const oppdaterTabISearchParam = (tab: string) => {
        searchParams.set("fane", tab);
        loggNavigertTilNyTab(tab);
        setSearchParams(searchParams, { replace: true });
    };

    React.useEffect(() => {
        if (fane !== "statistikk" && fane !== "historikk") {
            oppdaterTabISearchParam("statistikk");
        }
    }, [lasterIaSak]);
    const valgtSamarbeid = alleSamarbeid?.find(({ id }) => id && id === Number(prosessId));

    return (
        <VirksomhetContext.Provider
            value={{
                virksomhet,
                iaSak,
                lasterIaSak,
                fane,
                setFane: oppdaterTabISearchParam,
                spørreundersøkelseId: null,
            }}
        >
            <SamarbeidProvider samarbeid={valgtSamarbeid}>
                <Tabs
                    value={fane}
                    onChange={oppdaterTabISearchParam}
                    defaultValue="statistikk"
                    className={styles.virksomhetsTabs}
                >
                    <VStack className={styles.virksomhetsvisning} gap="0">
                        <VirksomhetOgSamarbeidsHeader
                            valgtSamarbeid={valgtSamarbeid}
                            virksomhet={virksomhet}
                            iaSak={iaSak}
                        />
                        <HStack gap="4" align="stretch" justify="center" flexGrow={"1"}>
                            <Samarbeidsvelger iaSak={iaSak} className={styles.samarbeidsvelgerSidebar} samarbeidsliste={alleSamarbeid} valgtSamarbeid={valgtSamarbeid} lasterSamarbeid={lasterSamarbeid || validererSamarbeid} virksomhet={virksomhet} />
                            <VirksomhetsvisningsSwitch valgtSamarbeid={valgtSamarbeid} virksomhet={virksomhet} iaSak={iaSak} laster={lasterIaSak || lasterSamarbeid} />
                        </HStack>
                    </VStack>
                </Tabs>
            </SamarbeidProvider>
        </VirksomhetContext.Provider>
    );
};

function VirksomhetsvisningsSwitch({ valgtSamarbeid, virksomhet, iaSak, laster }: { valgtSamarbeid?: IaSakProsess | null, virksomhet: Virksomhet, iaSak?: IASak, laster?: boolean }) {
    const [endreSamarbeidModalÅpen, setEndreSamarbeidModalÅpen] = React.useState(false);

    if (laster) {
        return <Loader />;
    }

    if (!valgtSamarbeid) {
        return (
            <div className={styles.innhold}>
                <Tabs.Panel value="statistikk">
                    <SykefraværsstatistikkFane virksomhet={virksomhet} />
                </Tabs.Panel>
                <Tabs.Panel value="historikk">
                    <SakshistorikkFane orgnr={virksomhet.orgnr} />
                </Tabs.Panel>
            </div>
        );
    }

    return (
        <>
            <div className={styles.innhold}>
                <div className={styles.blåTing}>
                    <HStack gap="4" align="center">
                        {valgtSamarbeid?.navn ?? <span />}
                        <SamarbeidStatusBadge
                            status={
                                valgtSamarbeid.status
                            }
                        />
                    </HStack>
                    <div>
                        <Button variant="secondary" onClick={() => setEndreSamarbeidModalÅpen(true)}>Administrer</Button>
                        <Salesforcelenke samarbeidId={valgtSamarbeid.id} />
                    </div>
                </div>
                <Samarbeidsinnhold valgtSamarbeid={valgtSamarbeid} iaSak={iaSak} />
            </div>
            {valgtSamarbeid && iaSak && (
                <EndreSamarbeidModal
                    samarbeid={valgtSamarbeid}
                    iaSak={iaSak}
                    open={endreSamarbeidModalÅpen}
                    setOpen={setEndreSamarbeidModalÅpen}
                />
            )}
        </>
    );
}

function Salesforcelenke({ samarbeidId }: { samarbeidId: number }) {
    const { data: salesforceSamarbeidsLenke } = useHentSalesforceSamarbeidLenke(samarbeidId);

    if (!salesforceSamarbeidsLenke) {
        return null;
    }

    return (
        <EksternLenke
            href={
                salesforceSamarbeidsLenke.salesforceLenke
            }
        >
            Salesforce - samarbeid
        </EksternLenke>
    );
}

function Samarbeidsinnhold({ valgtSamarbeid, iaSak }: { valgtSamarbeid: IaSakProsess, iaSak?: IASak }) {
    const [searchParams, setSearchParams] = useSearchParams();
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
    const fane = searchParams.get("fane") ?? "behovsvurdering";

    return (
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
            </Tabs.List>
            <Tabs.Panel
                value="behovsvurdering"
            >
                {iaSak && (
                    <BehovsvurderingFane
                        iaSak={iaSak}
                        gjeldendeSamarbeid={valgtSamarbeid}
                    />
                )}
            </Tabs.Panel>
            <Tabs.Panel value="plan">
                {iaSak && (
                    <SamarbeidsplanFane
                        iaSak={iaSak}
                        samarbeid={valgtSamarbeid}
                    />
                )}
            </Tabs.Panel>
            <Tabs.Panel
                value="evaluering"
            >
                {iaSak && (
                    <EvalueringFane
                        iaSak={iaSak}
                        gjeldendeSamarbeid={valgtSamarbeid}
                    />
                )}
            </Tabs.Panel>
        </Tabs>
    );
}