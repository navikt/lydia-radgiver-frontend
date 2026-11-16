import {
    Mål,
    MålSchema,
    Samarbeidsmål,
    Sykefraværsmål,
} from "../../domenetyper/mål";
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

export const lagreSykefraværsmål = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: number,
    sykefraværsmål: Sykefraværsmål[],
): Promise<Mål> =>
    put(
        `${målPath(orgnummer, saksnummer, samarbeidId)}/sykefravaersmaal`,
        MålSchema,
        sykefraværsmål,
    );

export const lagreSamarbeidsmål = (
    orgnummer: string,
    saksnummer: string,
    samarbeidId: number,
    samarbeidsmål: Samarbeidsmål[],
): Promise<Mål> =>
    put(
        `${målPath(orgnummer, saksnummer, samarbeidId)}/samarbeidsmaal`,
        MålSchema,
        samarbeidsmål,
    );
