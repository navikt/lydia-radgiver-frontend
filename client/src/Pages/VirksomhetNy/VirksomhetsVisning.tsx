import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Bleed, Box, Button, HStack, Loader, Tabs, VStack } from "@navikt/ds-react";
import { Virksomhet } from "../../domenetyper/virksomhet";
import { useHentSakForVirksomhet, useHentSalesforceSamarbeidLenke } from "../../api/lydia-api/virksomhet";
import VirksomhetContext from "../Virksomhet/VirksomhetContext";
import VirksomhetOgSamarbeidsHeader from "./Virksomhetsoversikt/VirksomhetsinfoHeader/VirksomhetOgSamarbeidsHeader";
import styles from './virksomhetsvisning.module.scss';
import Samarbeidsvelger from "./Samarbeidsvelger";
import { IaSakProsess } from "../../domenetyper/iaSakProsess";
import { useHentSamarbeid } from "../../api/lydia-api/spørreundersøkelse";
import { loggNavigertTilNyTab } from "../../util/analytics-klient";
import { SykefraværsstatistikkFane } from "../Virksomhet/Statistikk/SykefraværsstatistikkFane";
import { SakshistorikkFane } from "../Virksomhet/Sakshistorikk/SakshistorikkFane";
import { SamarbeidProvider } from "../Virksomhet/Samarbeid/SamarbeidContext";
import { EndreSamarbeidModal } from "../Virksomhet/Samarbeid/EndreSamarbeidModal";
import { IASak } from "../../domenetyper/domenetyper";
import { EksternLenke } from "../../components/EksternLenke";

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
                    <Bleed color="red-400">
                        <Box background="surface-danger-subtle" padding="space-12">
                            NY VIRKSOMHETSVISNING
                        </Box>
                    </Bleed>
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
                    {valgtSamarbeid?.navn ?? <span />}
                    <div>
                        <Button variant="secondary" onClick={() => setEndreSamarbeidModalÅpen(true)}>Administrer</Button><Salesforcelenke samarbeidId={valgtSamarbeid.id} />
                    </div>
                </div>
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