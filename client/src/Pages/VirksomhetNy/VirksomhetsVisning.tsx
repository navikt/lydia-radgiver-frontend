import React from "react";
import { useSearchParams } from "react-router-dom";
import { Bleed, Box, Button, Tabs } from "@navikt/ds-react";
import { SakshistorikkFane } from "../Virksomhet/Sakshistorikk/SakshistorikkFane";
import { Virksomhet } from "../../domenetyper/virksomhet";
import { useHentSakForVirksomhet } from "../../api/lydia-api/virksomhet";
import { SykefraværsstatistikkFane } from "../Virksomhet/Statistikk/SykefraværsstatistikkFane";
import VirksomhetContext from "../Virksomhet/VirksomhetContext";
import VirksomhetOgSamarbeidsHeader from "./Virksomhetsoversikt/VirksomhetsinfoHeader/VirksomhetOgSamarbeidsHeader";
import styles from './virksomhetsvisning.module.scss';
import Samarbeidsvelger from "./Samarbeidsvelger";
import { IaSakProsess } from "../../domenetyper/iaSakProsess";
import { useHentSamarbeid } from "../../api/lydia-api/spørreundersøkelse";

interface Props {
    virksomhet: Virksomhet;
}

export const VirksomhetsVisning = ({ virksomhet }: Props) => {
    const { data: iaSak, loading: lasterIaSak } = useHentSakForVirksomhet(
        virksomhet.orgnr,
        virksomhet.aktivtSaksnummer ?? undefined,
    );
    const { data: alleSamarbeid } = useHentSamarbeid(iaSak?.orgnr, iaSak?.saksnummer);
    const [searchParams, setSearchParams] = useSearchParams();
    const fane = searchParams.get("fane") ?? "statistikk";

    const oppdaterTabISearchParam = (tab: string) => {
        searchParams.set("fane", tab);
        setSearchParams(searchParams, { replace: true });
    };

    React.useEffect(() => {
        if (fane !== "statistikk" && fane !== "historikk") {
            oppdaterTabISearchParam("statistikk");
        }
    }, [lasterIaSak]);
    const [valgtSamarbeid, setValgtSamarbeid] = React.useState<IaSakProsess | null>(null);

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
            <Bleed color="red-400">
                <Box background="surface-danger-subtle" padding="space-12">
                    NY VIRKSOMHETSVISNING
                </Box>
            </Bleed>
            <div className={styles.virksomhetsvisning}>
                <VirksomhetOgSamarbeidsHeader
                    virksomhet={virksomhet}
                    iaSak={iaSak}
                />
                <Tabs
                    value={fane}
                    onChange={oppdaterTabISearchParam}
                    defaultValue="statistikk"
                >
                    <Tabs.List style={{ width: "100%" }}>
                        <Tabs.Tab
                            value="statistikk"
                            label="Sykefraværsstatistikk"
                        />
                        <Tabs.Tab value="historikk" label="Historikk" />
                    </Tabs.List>
                    <div className={styles.virksomhetsinnholdContainer}>
                        <Samarbeidsvelger className={styles.samarbeidsvelgerSidebar} samarbeidsliste={alleSamarbeid} setValgtSamarbeid={setValgtSamarbeid} valgtSamarbeid={valgtSamarbeid} />
                        <div className={styles.innhold}>
                            <div className={styles.blåTing}>{valgtSamarbeid?.navn ?? <span />}<div><Button variant="secondary">Administrer</Button><Button variant="tertiary">Salesforce</Button></div></div>
                            <Tabs.Panel className={styles.panel} value="statistikk">
                                <SykefraværsstatistikkFane virksomhet={virksomhet} />
                            </Tabs.Panel>
                            <Tabs.Panel className={styles.panel} value="historikk">
                                <SakshistorikkFane orgnr={virksomhet.orgnr} />
                            </Tabs.Panel>
                        </div>
                    </div>
                </Tabs>
            </div>
        </VirksomhetContext.Provider>
    );
};
