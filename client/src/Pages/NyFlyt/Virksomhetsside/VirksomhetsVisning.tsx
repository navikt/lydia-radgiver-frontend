import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, HStack, Tabs, VStack } from "@navikt/ds-react";
import { Virksomhet } from "../../../domenetyper/virksomhet";
import {
    useHentSalesforceSamarbeidLenke,
} from "../../../api/lydia-api/virksomhet";
import VirksomhetContext from "../../Virksomhet/VirksomhetContext";
import VirksomhetOgSamarbeidsHeader from "./VirksomhetsinfoHeader/VirksomhetOgSamarbeidsHeader";
import styles from "../../Virksomhet/virksomhetsvisning.module.scss";
import Samarbeidsvelger from "./Samarbeidsvelger";
import {
    IaSakProsess,
    IASamarbeidStatusType,
} from "../../../domenetyper/iaSakProsess";
import { useHentSamarbeid } from "../../../api/lydia-api/spørreundersøkelse";
import { loggNavigertTilNyTab } from "../../../util/analytics-klient";
import { SykefraværsstatistikkFane } from "../../Virksomhet/Statistikk/SykefraværsstatistikkFane";
import { SakshistorikkFane } from "../../Virksomhet/Sakshistorikk/SakshistorikkFane";
import { SamarbeidProvider } from "../../Virksomhet/Samarbeid/SamarbeidContext";
import { EndreSamarbeidModal } from "../../Virksomhet/Samarbeid/EndreSamarbeidModal";
import { IASak } from "../../../domenetyper/domenetyper";
import { EksternLenke } from "../../../components/EksternLenke";
import SamarbeidsplanFane from "../../Virksomhet/Plan/SamarbeidsplanFane";
import { SamarbeidStatusBadge } from "../../../components/Badge/SamarbeidStatusBadge";
import { Kartleggingsliste } from "../../Virksomhet/Kartlegging/Kartleggingsliste";
import { useHentTeam } from "../../../api/lydia-api/team";
import {
    erSaksbehandler,
    useHentBrukerinformasjon,
} from "../../../api/lydia-api/bruker";
import { useHarPlan } from "../../../api/lydia-api/plan";
import { useHentSakNyFlyt } from "../../../api/lydia-api/nyFlyt";

interface Props {
    virksomhet: Virksomhet;
}

export const VirksomhetsVisning = ({ virksomhet }: Props) => {
    const { /* saksnummer, */ prosessId } = useParams();

    const { data: iaSak, loading: lasterIaSak } = useHentSakNyFlyt(
        virksomhet.orgnr,
        //saksnummer ?? virksomhet.aktivtSaksnummer ?? undefined,
    );

    const { data: alleSamarbeid, loading: lasterSamarbeid } = useHentSamarbeid(
        iaSak?.orgnr,
        iaSak?.saksnummer,
    );
    const [searchParams, setSearchParams] = useSearchParams();
    const fane = searchParams.get("fane") ?? "statistikk";

    const oppdaterTabISearchParam = (tab: string) => {
        searchParams.set("fane", tab);
        loggNavigertTilNyTab(tab);
        setSearchParams(searchParams, { replace: true });
    };

    const valgtSamarbeid = alleSamarbeid?.find(
        ({ id }) => id && id === Number(prosessId),
    );

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
                        <HStack
                            align="stretch"
                            justify="start"
                            flexGrow="1"
                            wrap={false}
                        >
                            <Samarbeidsvelger
                                iaSak={iaSak}
                                className={styles.samarbeidsvelgerSidebar}
                                samarbeidsliste={alleSamarbeid}
                                valgtSamarbeid={valgtSamarbeid}
                                lasterSamarbeid={lasterSamarbeid}
                                virksomhet={virksomhet}
                            />
                            <VirksomhetsvisningsSwitch
                                valgtSamarbeid={valgtSamarbeid}
                                virksomhet={virksomhet}
                                iaSak={iaSak}
                            />
                        </HStack>
                    </VStack>
                </Tabs>
            </SamarbeidProvider>
        </VirksomhetContext.Provider>
    );
};

function VirksomhetsvisningsSwitch({
    valgtSamarbeid,
    virksomhet,
    iaSak,
}: {
    valgtSamarbeid?: IaSakProsess | null;
    virksomhet: Virksomhet;
    iaSak?: IASak;
}) {
    const [endreSamarbeidModalÅpen, setEndreSamarbeidModalÅpen] =
        React.useState(false);

    const { data: følgere = [] } = useHentTeam(iaSak?.saksnummer);
    const { data: brukerInformasjon } = useHentBrukerinformasjon();
    const brukerFølgerSak = følgere.some(
        (følger) => følger === brukerInformasjon?.ident,
    );
    const brukerErEierAvSak = iaSak?.eidAv === brukerInformasjon?.ident;
    const kanEndreSpørreundersøkelser =
        (erSaksbehandler(brukerInformasjon) &&
            (brukerFølgerSak || brukerErEierAvSak)) ||
        false;
    const samarbeidKanEndres =
        valgtSamarbeid &&
        !["AVBRUTT", "SLETTET", "FULLFØRT"].includes(valgtSamarbeid.status);
    const erIÅpenSak =
        iaSak &&
        ![
            "IKKE_AKTIV",
            "IKKE_AKTUELL",
            "FULLFØRT",
            "SLETTET",
            "AVBRUTT",
        ].includes(iaSak.status);

    const { harPlan, lastet: harPlanLastet } = useHarPlan(
        iaSak?.orgnr,
        iaSak?.saksnummer,
        valgtSamarbeid?.id,
    );

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
                <div
                    className={`${styles.statuslinje} ${getKlassenavnForSamarbeidsstatus(valgtSamarbeid.status)}`}
                >
                    <HStack gap="4" align="center">
                        <span className={styles.tittel}>
                            {valgtSamarbeid?.navn}
                        </span>
                        {valgtSamarbeid.status !== "AKTIV" && (
                            <SamarbeidStatusBadge
                                slim
                                status={valgtSamarbeid.status}
                            />
                        )}
                    </HStack>
                    <HStack gap="8" align="center">
                        {kanEndreSpørreundersøkelser &&
                            erIÅpenSak &&
                            samarbeidKanEndres && (
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={() =>
                                        setEndreSamarbeidModalÅpen(true)
                                    }
                                >
                                    Administrer
                                </Button>
                            )}
                        <Salesforcelenke samarbeidId={valgtSamarbeid.id} />
                    </HStack>
                </div>
                <div style={{ padding: "1.5rem" }}>
                    {harPlanLastet && (
                        <Samarbeidsinnhold
                            valgtSamarbeid={valgtSamarbeid}
                            iaSak={iaSak}
                            harPlan={harPlan}
                        />
                    )}
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
    const { data: salesforceSamarbeidsLenke } =
        useHentSalesforceSamarbeidLenke(samarbeidId);

    if (!salesforceSamarbeidsLenke) {
        return null;
    }

    return (
        <EksternLenke
            href={
                salesforceSamarbeidsLenke.salesforceLenke
            }
            className={styles.salesforcelenke}
        >
            Salesforce - samarbeid
        </EksternLenke>
    );
}

function Samarbeidsinnhold({
    valgtSamarbeid,
    iaSak,
    harPlan,
}: {
    valgtSamarbeid: IaSakProsess;
    iaSak?: IASak;
    harPlan?: boolean;
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const oppdaterTabISearchParam = (tab: string) => {
        searchParams.set("fane", tab);
        loggNavigertTilNyTab(tab);
        setSearchParams(searchParams, { replace: true });
    };

    const defaultFane = harPlan ? "plan" : "kartlegging";

    const fane = searchParams.get("fane") ?? defaultFane;

    return (
        <Tabs
            value={fane}
            onChange={oppdaterTabISearchParam}
            defaultValue={defaultFane}
        >
            <Tabs.List style={{ width: "100%" }}>
                {iaSak && <Tabs.Tab value="plan" label="Samarbeidsplan" />}
                {iaSak && (
                    <Tabs.Tab value="kartlegging" label="Kartlegginger" />
                )}
            </Tabs.List>
            <Tabs.Panel value="plan">
                {iaSak && (
                    <SamarbeidsplanFane
                        iaSak={iaSak}
                        samarbeid={valgtSamarbeid}
                    />
                )}
            </Tabs.Panel>
            <Tabs.Panel value="kartlegging">
                <Kartleggingsliste
                    iaSak={iaSak}
                    gjeldendeSamarbeid={valgtSamarbeid}
                />
            </Tabs.Panel>
        </Tabs>
    );
}

function getKlassenavnForSamarbeidsstatus(status: IASamarbeidStatusType) {
    switch (status) {
        case "AKTIV":
            return styles.aktiv;
        case "FULLFØRT":
            return styles.fullført;
        case "AVBRUTT":
            return styles.avbrutt;
        case "SLETTET":
            return styles.slettet;
        default:
            return "";
    }
}
