import { PlanInnhold } from "../../../domenetyper/plan";
import { isoDato } from "../../../util/dato";

export type TemaRequest = {
    id: number;
    inkludert: boolean;
    undertemaer: UndertemaRequest[];
};

export type UndertemaRequest = {
    id: number;
    inkludert: boolean;
    startDato: string | null;
    sluttDato: string | null;
};

export function lagRequest(undertemaer: PlanInnhold[]): UndertemaRequest[] {
    return undertemaer.map((undertema) => {
        return {
            id: undertema.id,
            inkludert: undertema.inkludert,
            startDato:
                undertema.startDato === null
                    ? null
                    : isoDato(undertema.startDato),
            sluttDato:
                undertema.sluttDato === null
                    ? null
                    : isoDato(undertema.sluttDato),
        };
    });
}
