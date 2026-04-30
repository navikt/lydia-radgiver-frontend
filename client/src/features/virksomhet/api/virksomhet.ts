import {
    defaultSwrConfiguration,
    useSwrTemplate,
} from "@/api/lydia-api/networkRequests";
import {
    bransjePath,
    historiskStatistikkPath,
    iaSakPath,
    næringPath,
    publiseringsinfoPath,
    salesforceUrlPath,
    siste4kvartalerPath,
    sistekvartalPath,
    sykefraværsstatistikkPath,
    virksomhetsPath,
} from "@/api/lydia-api/paths";
import {
    Publiseringsinfo,
    publiseringsinfoSchema,
} from "@features/plan/types/publiseringsinfo";
import {
    SalesforceInfo,
    salesforceInfoSchema,
    SalesforceSamarbeid,
    salesforceSamarbeidSchema,
} from "@features/sak/types/salesforceInfo";
import {
    kanGjennomføreStatusendringDto,
    KanGjennomføreStatusendring,
    MuligSamarbeidsgandling,
} from "@features/sak/types/samarbeidsEndring";
import {
    Bransjestatistikk,
    bransjestatistikkSchema,
    Næringsstatistikk,
    næringsstatistikkSchema,
} from "@features/virksomhet/types/bransjestatistikk";
import {
    HistoriskStatistikk,
    historiskStatistikkSchema,
} from "@features/virksomhet/types/historiskstatistikk";
import {
    Næring,
    Virksomhet,
    virksomhetsSchema,
} from "@features/virksomhet/types/virksomhet";
import {
    VirksomhetsstatistikkSiste4Kvartaler,
    virksomhetsstatistikkSiste4KvartalerSchema,
} from "@features/virksomhet/types/virksomhetsstatistikkSiste4Kvartaler";
import {
    VirkomshetsstatistikkSisteKvartal,
    virksomhetsstatistikkSisteKvartalSchema,
} from "@features/virksomhet/types/virksomhetsstatistikkSisteKvartal";

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

export const useHentSalesforceSamarbeidLenke = (samarbeidsId?: number) => {
    return useSwrTemplate<SalesforceSamarbeid>(
        samarbeidsId ? `${salesforceUrlPath}/samarbeid/${samarbeidsId}` : null,
        salesforceSamarbeidSchema,
        defaultSwrConfiguration,
        false,
    );
};

export const useKanUtføreHandlingPåSamarbeid = (
    orgnummer?: string,
    saksnummer?: string,
    prosessId?: number,
    handling: MuligSamarbeidsgandling = "slettes",
) => {
    return useSwrTemplate<KanGjennomføreStatusendring>(
        orgnummer && saksnummer && prosessId
            ? `${iaSakPath}/${orgnummer}/${saksnummer}/${prosessId}/kan/${handling}`
            : null,
        kanGjennomføreStatusendringDto,
        defaultSwrConfiguration,
        false,
    );
};

export const getKanGjennomføreStatusendring = async (
    orgnummer: string,
    saksnummer: string,
    prosessId: number,
    handling: MuligSamarbeidsgandling,
): Promise<KanGjennomføreStatusendring> => {
    try {
        const response = await fetch(
            `${iaSakPath}/${orgnummer}/${saksnummer}/${prosessId}/kan/${handling}`,
        );
        if (!response.ok) {
            throw new Error("Kunne ikke hente 'kan gjøre handling'");
        }

        return (await response.json()) as KanGjennomføreStatusendring;
    } catch (error) {
        console.error(error);
        return Promise.reject(error);
    }
};
