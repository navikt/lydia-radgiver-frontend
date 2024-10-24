import { z } from "zod";
import {
    Leveranse,
    LeveranseOppdateringDTO,
    LeveranserPerIATjeneste,
    leveranserPerIATjenesteSchema,
    leveranseSchema,
    LeveranseStatusEnum,
    NyLeveranseDTO,
} from "../../domenetyper/leveranse";
import { isoDato } from "../../util/dato";
import { httpDelete, post, put, useSwrTemplate } from "./networkRequests";
import { leveransePath } from "./paths";

export const nyLeveransePåSak = (
    orgnummer: string,
    saksnummer: string,
    modulId: number,
    frist: Date,
): Promise<Leveranse> => {
    const nyLeveranseDTO: NyLeveranseDTO = {
        saksnummer: saksnummer,
        modulId: modulId,
        frist: isoDato(frist),
    };
    return post(
        `${leveransePath}/${orgnummer}/${saksnummer}`,
        leveranseSchema,
        nyLeveranseDTO,
    );
};

export const merkLeveranseSomLevert = (
    orgnummer: string,
    saksnummer: string,
    leveranseId: number,
): Promise<Leveranse> => {
    const oppdaterLeveranseDTO: LeveranseOppdateringDTO = {
        status: LeveranseStatusEnum.enum.LEVERT,
    };
    return put(
        `${leveransePath}/${orgnummer}/${saksnummer}/${leveranseId}`,
        leveranseSchema,
        oppdaterLeveranseDTO,
    );
};

export const slettLeveranse = (
    orgnummer: string,
    saksnummer: string,
    leveranseId: number,
): Promise<number> => {
    return httpDelete(
        `${leveransePath}/${orgnummer}/${saksnummer}/${leveranseId}`,
        z.number(),
    );
};

export const useHentLeveranser = (orgnummer: string, saksnummer: string) => {
    return useSwrTemplate<LeveranserPerIATjeneste[]>(
        orgnummer ? `${leveransePath}/${orgnummer}/${saksnummer}` : null,
        leveranserPerIATjenesteSchema.array(),
        {
            revalidateOnFocus: true,
        },
    );
};
