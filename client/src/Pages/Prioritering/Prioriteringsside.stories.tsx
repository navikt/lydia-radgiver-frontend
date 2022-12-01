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
import { MemoryRouter, Route, Routes } from "react-router-dom";

export default {
    title: "Prioritering/Prioriteringsside",
    component: Prioriteringsside,
    decorators: [(Story) => (
        <MemoryRouter initialEntries={["/?sykefraversprosentFra=0.00&sykefraversprosentTil=100.00&ansatteFra=5&side=1"]}>
            <Routes>
                <Route
                    path={"/"}
                    element={<Story />}
                />
            </Routes>
        </MemoryRouter>
    )]
} as ComponentMeta<typeof Prioriteringsside>;

export const PrioriteringssideMedDataStory = () => (<Prioriteringsside />);

PrioriteringssideMedDataStory.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(filterverdierPath, (req, res, ctx) => {
                    return res(ctx.json(filterverdierMock));
                }),
                rest.get(sykefraværsstatistikkPath, (req, res, ctx) => {
                    return res(
                        ctx.delay(2000),
                        ctx.json({
                            data: sykefraværsstatistikkMock,
                            total: 500000,
                        })
                    )
                }),
            ],
        }
    },
};


export const PrioriteringssideUtenResultaterFraSøkStory = () => (<Prioriteringsside />);

PrioriteringssideUtenResultaterFraSøkStory.parameters = {
    msw: {
        handlers: {
            others: [
                rest.get(filterverdierPath, (req, res, ctx) => {
                    return res(ctx.json(filterverdierMock));
                }),
                rest.get(sykefraværsstatistikkPath, (req, res, ctx) => {
                    return res(
                        ctx.json({
                            data: [],
                            total: 0,
                        })
                    );
                }),
            ],
        }
    },
};
