import { PlanInnhold } from "../../../domenetyper/plan";
import { isoDato } from "../../../util/dato";

export type TemaRequest = {
    id: number;
    planlagt: boolean;
    undertemaer: UndertemaRequest[];
};

export type UndertemaRequest = {
    id: number;
    planlagt: boolean;
    startDato: string | null;
    sluttDato: string | null;
};

export function lagRequest(undertemaer: PlanInnhold[]): UndertemaRequest[] {
    return undertemaer.map((undertema) => {
        return {
            id: undertema.id,
            planlagt: undertema.planlagt,
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
