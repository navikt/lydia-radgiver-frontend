import {
    Bransjestatistikk,
    bransjestatistikkSchema,
    Næringsstatistikk,
    næringsstatistikkSchema,
} from "../../domenetyper/bransjestatistikk";
import { IASak, iaSakSchema } from "../../domenetyper/domenetyper";
import {
    HistoriskStatistikk,
    historiskStatistikkSchema,
} from "../../domenetyper/historiskstatistikk";
import { KanSletteSamarbeid } from "../../domenetyper/kanSletteSamarbeid";
import {
    Publiseringsinfo,
    publiseringsinfoSchema,
} from "../../domenetyper/publiseringsinfo";
import {
    Sakshistorikk,
    sakshistorikkSchema,
} from "../../domenetyper/sakshistorikk";
import {
    SalesforceInfo,
    salesforceInfoSchema,
} from "../../domenetyper/salesforceInfo";
import {
    Næring,
    Virksomhet,
    virksomhetsSchema,
} from "../../domenetyper/virksomhet";
import {
    VirksomhetsstatistikkSiste4Kvartaler,
    virksomhetsstatistikkSiste4KvartalerSchema,
} from "../../domenetyper/virksomhetsstatistikkSiste4Kvartaler";
import {
    VirkomshetsstatistikkSisteKvartal,
    virksomhetsstatistikkSisteKvartalSchema,
} from "../../domenetyper/virksomhetsstatistikkSisteKvartal";
import { defaultSwrConfiguration, useSwrTemplate } from "./networkRequests";
import {
    bransjePath,
    historiskStatistikkPath,
    iaSakHistorikkPath,
    iaSakPath,
    næringPath,
    publiseringsinfoPath,
    salesforceUrlPath,
    siste4kvartalerPath,
    sistekvartalPath,
    sykefraværsstatistikkPath,
    virksomhetsPath,
} from "./paths";

export const useHentVirksomhetsstatistikkSiste4Kvartaler = (
    orgnummer?: string,
) => {
    return useSwrTemplate<VirksomhetsstatistikkSiste4Kvartaler>(
        orgnummer
            ? `${sykefraværsstatistikkPath}/${orgnummer}/${siste4kvartalerPath}`
            : null,
        virksomhetsstatistikkSiste4KvartalerSchema,
        {
            revalidateOnFocus: true,
        },
    );
};
export const useHentPubliseringsinfo = () => {
    return useSwrTemplate<Publiseringsinfo>(
        `${sykefraværsstatistikkPath}/${publiseringsinfoPath}`,
        publiseringsinfoSchema,
        {
            revalidateOnFocus: false,
        },
    );
};
export const useHentSykefraværsstatistikkForVirksomhetSisteKvartal = (
    orgnummer?: string,
) => {
    return useSwrTemplate<VirkomshetsstatistikkSisteKvartal>(
        orgnummer
            ? `${sykefraværsstatistikkPath}/${orgnummer}/${sistekvartalPath}`
            : null,
        virksomhetsstatistikkSisteKvartalSchema,
        {
            revalidateOnFocus: true,
        },
    );
};
export const useHentBransjestatistikk = (bransje: string | null) => {
    return useSwrTemplate<Bransjestatistikk>(
        bransje
            ? `${sykefraværsstatistikkPath}/${bransjePath}/${bransje}`
            : null,
        bransjestatistikkSchema,
        {
            revalidateOnFocus: false,
        },
    );
};
export const useHentNæringsstatistikk = (næring: Næring) => {
    return useSwrTemplate<Næringsstatistikk>(
        `${sykefraværsstatistikkPath}/${næringPath}/${næring.kode}`,
        næringsstatistikkSchema,
        {
            revalidateOnFocus: false,
        },
    );
};
export const useHentVirksomhetsinformasjon = (orgnummer?: string) => {
    return useSwrTemplate<Virksomhet>(
        orgnummer ? `${virksomhetsPath}/${orgnummer}` : null,
        virksomhetsSchema,
        {
            revalidateOnFocus: true,
        },
    );
};
export const useHentAktivSakForVirksomhet = (orgnummer?: string) => {
    const iasakUrl = `${iaSakPath}/${orgnummer}/aktiv`;
    return useSwrTemplate<IASak | undefined>(iasakUrl, iaSakSchema.optional(), {
        revalidateOnFocus: true,
    });
};
export const useHentSamarbeidshistorikk = (orgnummer?: string) => {
    return useSwrTemplate<Sakshistorikk[]>(
        () => (orgnummer ? `${iaSakHistorikkPath}/${orgnummer}` : null),
        sakshistorikkSchema.array(),
        {
            revalidateOnFocus: true,
        },
    );
};
export const useHentHistoriskstatistikk = (orgnummer?: string) => {
    const historiskStatistikkUrl = `${sykefraværsstatistikkPath}/${orgnummer}/${historiskStatistikkPath}`;
    return useSwrTemplate<HistoriskStatistikk>(
        historiskStatistikkUrl,
        historiskStatistikkSchema,
        {
            revalidateOnFocus: false,
        },
    );
};
export const useHentSalesforceUrl = (orgnr: string) => {
    return useSwrTemplate<SalesforceInfo>(
        `${salesforceUrlPath}/${orgnr}`,
        salesforceInfoSchema,
        defaultSwrConfiguration,
        false,
    );
};

export const getKanSletteSamarbeid = async (orgnummer: string, saksnummer: string, prosessId: number) => {
    try {
        const response = await fetch(`${iaSakPath}/${orgnummer}/${saksnummer}/${prosessId}/kanslettes`);
        if (!response.ok) {
            throw new Error("Kunne ikke hente 'kan slette samarbeid'");
        }
    
        return await response.json() as KanSletteSamarbeid;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
}