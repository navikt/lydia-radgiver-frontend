import { Mål, MålSchema } from "../../domenetyper/mål";
import { put, useSwrTemplate } from "./networkRequests";
import { nyFlytApiBasePath } from "./paths";

const målPath = (orgnummer: string, saksnummer: string, samarbeidId: number) =>
    `${nyFlytApiBasePath}/virksomhet/${orgnummer}/samarbeidsperiode/${saksnummer}/samarbeid/${samarbeidId}/maal`;

export const useHentMål = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: number,
) =>
    useSwrTemplate<Mål>(målPath(orgnummer, saksnummer, samarbeidId), MålSchema);

export const lagreMål = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: number,
    mål: Mål,
): Promise<Mål> =>
    put(målPath(orgnummer, saksnummer, samarbeidId), MålSchema, mål);
