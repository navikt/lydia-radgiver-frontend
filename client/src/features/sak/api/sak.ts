import { post, useSwrTemplate } from "@/api/lydia-api/networkRequests";
import {
    iaSakPath,
    iaSakPostNyHendelsePath,
    mineSakerPath,
} from "@/api/lydia-api/paths";
import {
    GyldigNesteHendelse,
    IANySakshendelseDto,
    IASak,
    iaSakSchema,
    ValgtÅrsakDto,
} from "@/domenetyper/domenetyper";
import {
    MineSaker,
    mineSakerListSchema,
} from "@features/mineSaker/types/mineSaker";
import { IaSakProsess } from "@features/sak/types/iaSakProsess";
import {
    IaSakStatus,
    iaSakStatusSchema,
} from "@features/sak/types/iaSakStatus";

export const opprettSak = (orgnummer: string): Promise<IASak> =>
    post(`${iaSakPath}/${orgnummer}`, iaSakSchema);
export const nyHendelsePåSak = (
    sak: IASak,
    hendelse: GyldigNesteHendelse,
    valgtÅrsak: ValgtÅrsakDto | null = null,
    prosessDto: IaSakProsess | null = null,
): Promise<IASak> => {
    const nyHendelseDto: IANySakshendelseDto = {
        orgnummer: sak.orgnr,
        saksnummer: sak.saksnummer,
        hendelsesType: hendelse.saksHendelsestype,
        endretAvHendelseId: sak.endretAvHendelseId,
        ...(valgtÅrsak && { payload: JSON.stringify(valgtÅrsak) }),
        ...(prosessDto && { payload: JSON.stringify(prosessDto) }),
    };
    return post(iaSakPostNyHendelsePath, iaSakSchema, nyHendelseDto);
};
export const useHentIASaksStatus = (orgnummer: string, saksnummer: string) => {
    return useSwrTemplate<IaSakStatus>(
        `${iaSakPath}/${orgnummer}/${saksnummer}/status`,
        iaSakStatusSchema,
    );
};
export const useHentMineSaker = () => {
    return useSwrTemplate<MineSaker[]>(`${mineSakerPath}`, mineSakerListSchema);
};
