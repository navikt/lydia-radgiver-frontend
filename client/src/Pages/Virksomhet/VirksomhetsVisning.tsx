import React from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs } from "@navikt/ds-react";
import { SakshistorikkFane } from "./Sakshistorikk/SakshistorikkFane";
import { Virksomhet } from "../../domenetyper/virksomhet";
import { useHentSakForVirksomhet } from "../../api/lydia-api/virksomhet";
import { SykefraværsstatistikkFane } from "./Statistikk/SykefraværsstatistikkFane";
import VirksomhetContext from "./VirksomhetContext";
import VirksomhetOgSamarbeidsHeader from "./Virksomhetsoversikt/VirksomhetsinfoHeader/VirksomhetOgSamarbeidsHeader";
import styles from './virksomhetsvisning.module.scss';

interface Props {
    virksomhet: Virksomhet;
}

export const VirksomhetsVisning = ({ virksomhet }: Props) => {
    const { data: iaSak, loading: lasterIaSak } = useHentSakForVirksomhet(
        virksomhet.orgnr,
        virksomhet.aktivtSaksnummer ?? undefined,
    );
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
            <div className={styles.virksomhetsvisning}>
                <VirksomhetOgSamarbeidsHeader
                    virksomhet={virksomhet}
                    iaSak={iaSak}
                />
                <br />
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
                    <Tabs.Panel className={styles.panel} value="statistikk">
                        <SykefraværsstatistikkFane virksomhet={virksomhet} />
                    </Tabs.Panel>
                    <Tabs.Panel className={styles.panel} value="historikk">
                        <SakshistorikkFane orgnr={virksomhet.orgnr} />
                    </Tabs.Panel>
                </Tabs>
            </div>
        </VirksomhetContext.Provider>
    );
};
