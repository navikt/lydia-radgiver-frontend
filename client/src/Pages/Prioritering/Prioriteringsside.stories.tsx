import { ComponentMeta } from "@storybook/react";
import "@navikt/ds-css";
import Prioriteringsside from "./Prioriteringsside";
import { rest } from "msw";
import {
    filterverdierPath,
    sykefraværsstatistikkPath,
} from "../../api/lydia-api";
import { filterverdierMock } from "./mocks/filterverdierMock";
import { sykefraværsstatistikkMock } from "./mocks/sykefraværsstatistikkMock";

export default {
    title: "Prioritering/Prioriteringsside",
    component: Prioriteringsside,
} as ComponentMeta<typeof Prioriteringsside>;

export const PrioriteringssideMedData = () => <Prioriteringsside />;

PrioriteringssideMedData.parameters = {
    msw: {
        handlers: [
            rest.get(filterverdierPath, (req, res, ctx) => {
                return res(ctx.json(filterverdierMock));
            }),
            rest.get(sykefraværsstatistikkPath, (req, res, ctx) => {
                return res(
                    ctx.json({
                        data: sykefraværsstatistikkMock,
                        total: 500000,
                    })
                );
            }),
        ],
    },
};
