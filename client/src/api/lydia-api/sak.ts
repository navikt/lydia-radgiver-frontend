import {
    GyldigNesteHendelse,
    IANySakshendelseDto,
    IASak,
    iaSakSchema,
    ValgtÅrsakDto,
} from "../../domenetyper/domenetyper";
import { IaSakProsess } from "../../domenetyper/iaSakProsess";
import { IaSakStatus, iaSakStatusSchema } from "../../domenetyper/iaSakStatus";
import { MineSaker, mineSakerListSchema } from "../../domenetyper/mineSaker";
import { post, useSwrTemplate } from "./networkRequests";
import { iaSakPath, iaSakPostNyHendelsePath, mineSakerPath } from "./paths";

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
